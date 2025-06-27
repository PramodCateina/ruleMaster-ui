import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Trash2, Download, Copy } from 'lucide-react';

interface Message {
  id: number;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
}

const ChatbotScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m your AI assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  
  // Properly typed refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on component mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);



  const handleSendMessage = async (): Promise<void> => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInputMessage = inputMessage; // Store the message before clearing
    setInputMessage('');
    setIsTyping(true);

    try {
      // Call the API
      const response = await fetch('http://localhost:4002/api/rules/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: currentInputMessage,
          tenant_id:'553e4567-e89b-12d3-a456-426614174000'
          // Add any other fields your API expects
        }),
      });

      console.log("responseresponseresponse",response);
      

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
     const botResponse: Message = {
        id: messages.length + 2,
        type: 'bot',
        content: `Rules created successfully. ${data.response || data.message}`,
        timestamp: new Date()
        };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error calling API:', error);
      
      // Fallback to simulated response if API fails
      const errorResponse: Message = {
        id: messages.length + 2,
        type: 'bot',
        content: 'Sorry, I\'m having trouble connecting to my servers right now. Please try again later.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = (): void => {
    setMessages([
      {
        id: 1,
        type: 'bot',
        content: 'Hello! I\'m your AI assistant. How can I help you today?',
        timestamp: new Date()
      }
    ]);
  };

  const exportChat = (): void => {
    const chatText = messages.map(msg => 
      `[${msg.timestamp.toLocaleTimeString()}] ${msg.type === 'bot' ? 'Bot' : 'You'}: ${msg.content}`
    ).join('\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-export-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyMessage = async (content: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(content);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  const formatTime = (timestamp: Date): string => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="content-card" style={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div className="card-header" style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Bot style={{ color: '#4CAF50' }} size={24} />
              AI Assistant
            </h2>
            <p className="card-subtitle">Ask me anything - I'm here to help!</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={clearChat}
              style={{
                padding: '8px 12px',
                backgroundColor: '#fff3f3',
                border: '1px solid #ffcdd2',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '14px',
                color: '#d32f2f'
              }}
              title="Clear Chat"
            >
              <Trash2 size={16} />
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '20px',
          backgroundColor: '#fafafa'
        }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              display: 'flex',
              justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '16px',
              alignItems: 'flex-start',
              gap: '10px'
            }}
          >
            {message.type === 'bot' && (
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#4CAF50',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Bot size={18} color="white" />
              </div>
            )}
            
            <div
              style={{
                maxWidth: '70%',
                backgroundColor: message.type === 'user' ? '#2196F3' : '#fff',
                color: message.type === 'user' ? 'white' : '#333',
                padding: '12px 16px',
                borderRadius: '18px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                position: 'relative',
                wordBreak: 'break-word'
              }}
            >
              <div>{message.content}</div>
              <div
                style={{
                  fontSize: '11px',
                  opacity: 0.7,
                  marginTop: '4px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>{formatTime(message.timestamp)}</span>
                <button
                  onClick={() => copyMessage(message.content)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    opacity: 0.6,
                    padding: '2px'
                  }}
                  title="Copy message"
                >
                  <Copy size={12} />
                </button>
              </div>
            </div>

            {message.type === 'user' && (
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#2196F3',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <User size={18} color="white" />
              </div>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#4CAF50',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Bot size={18} color="white" />
            </div>
            <div
              style={{
                backgroundColor: '#fff',
                padding: '12px 16px',
                borderRadius: '18px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#4CAF50',
                    animation: 'typing 1.4s infinite ease-in-out'
                  }}
                />
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#4CAF50',
                    animation: 'typing 1.4s infinite ease-in-out 0.2s'
                  }}
                />
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#4CAF50',
                    animation: 'typing 1.4s infinite ease-in-out 0.4s'
                  }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{ padding: '20px', borderTop: '1px solid #e0e0e0', backgroundColor: 'white' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            style={{
              flex: 1,
              minHeight: '44px',
              maxHeight: '120px',
              padding: '12px 16px',
              border: '1px solid #ddd',
              borderRadius: '22px',
              fontSize: '14px',
              resize: 'none',
              outline: 'none',
              fontFamily: 'inherit'
            }}
            rows={1}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: inputMessage.trim() && !isTyping ? '#2196F3' : '#ccc',
              border: 'none',
              cursor: inputMessage.trim() && !isTyping ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.3s'
            }}
          >
            <Send size={20} color="white" />
          </button>
        </div>
        {/* <div style={{ fontSize: '12px', color: '#666', marginTop: '8px', textAlign: 'center' }}>
          Press Enter to send • Shift + Enter for new line
        </div> */}
      </div>

      {/* CSS Animation for typing indicator */}
      <style>{`
        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
};

export default ChatbotScreen;