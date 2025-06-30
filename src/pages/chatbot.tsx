import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Send, Bot, User, Trash2, Download, Copy, ArrowLeft } from 'lucide-react'; // Added ArrowLeft
// CopilotKit imports are removed as they are causing compilation issues in this environment.
// The AI functionality will be simulated using direct API calls.

interface Message {
  id: number;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
}

// Main Dashboard Component (no longer wrapped with CopilotKit)
const ChatbotDashboard: React.FC = () => {
  return (
    <ChatbotScreen />
  );
};

// Enhanced Chatbot Screen with direct API integration
const ChatbotScreen: React.FC = () => {
  // Define an initial welcome message
  const initialWelcomeMessage: Message = {
    id: 0, // Use a distinct ID for the initial message
    type: 'bot',
    content: 'Hello! I\'m your AI assistant. I can help you create and manage business rules. How can I help you today?',
    timestamp: new Date()
  };

  const [messages, setMessages] = useState<Message[]>([initialWelcomeMessage]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false); // Local typing indicator

  // Properly typed refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]); // Scroll when the messages displayed are updated

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

    // Add user message to state immediately
    setMessages(prev => [...prev, userMessage]);
    const currentInputMessage = inputMessage; // Capture current input
    setInputMessage(''); // Clear input field

    setIsTyping(true); // Show typing indicator

    try {
      // Simulate AI response by directly calling the API
      const response = await fetch('http://localhost:4002/api/rules/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: currentInputMessage,
          tenant_id: '553e4567-e89b-12d3-a456-426614174000' // Using default tenant_id
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      console.log("JSON.stringify(data.data, null, 2)",JSON.stringify(data.data, null, 2));
      

     const botResponse: Message = {
      id: messages.length + 2,
      type: 'bot',
      content: `Rule created successfully!\nName: ${data.data.name}\nDescription: ${data.data.description}`,
      timestamp: new Date()
    };

      setMessages(prev => [...prev, botResponse]); // Add bot response to state
    } catch (error: any) {
      console.error('Error with API call:', error);
      const errorResponse: Message = {
        id: messages.length + 2,
        type: 'bot',
        content: `Sorry, I'm having trouble connecting right now or processing your request: ${error.message}. Please try again later.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false); // Hide typing indicator
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = (): void => {
    setMessages([initialWelcomeMessage]); // Reset to only the initial message
    setInputMessage(''); // Clear input field
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

  const copyMessage = (content: string): void => {
    // Using document.execCommand('copy') for iframe compatibility
    const textarea = document.createElement('textarea');
    textarea.value = content;
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      // Optional: Add a temporary visual feedback like "Copied!"
    } catch (err) {
      console.error('Failed to copy message using document.execCommand:', err);
    } finally {
      document.body.removeChild(textarea);
    }
  };

  const formatTime = (timestamp: Date): string => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleBack = (): void => {
  window.history.back();
};

  return (
    <div
      className="content-card"
      style={{
        height: 'calc(100vh - 200px)',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        fontFamily: '"Inter", sans-serif'
      }}
    >
      {/* Header */}
      <div
        className="card-header"
        style={{
          borderBottom: '1px solid #e0e0e0',
          padding: '15px 20px',
          backgroundColor: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap', // Allow wrapping on small screens
          gap: '10px'
        }}
      >
        <div style={{ flexGrow: 1 }}> {/* Use flexGrow to take available space */}
          <h2
            className="card-title"
            style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.25rem', fontWeight: '600', color: '#333' }}
          >
            <Bot style={{ color: '#4CAF50' }} size={24} />
            AI Assistant
          </h2>
          <p className="card-subtitle" style={{ fontSize: '0.9rem', color: '#666', marginTop: '4px' }}>
            Ask me anything about rules - I'm here to help!
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {/* Back Button */}
          <button
            onClick={handleBack}
            style={{
              padding: '8px 12px',
              backgroundColor: '#e3f2fd', // Light blue background
              border: '1px solid #90caf9', // Blue border
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '14px',
              color: '#1976d2', // Darker blue text
              transition: 'background-color 0.2s ease, border-color 0.2s ease',
            }}
            title="Go Back"
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#bbdefb')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#e3f2fd')}
          >
            <ArrowLeft size={16} />
            Back
          </button>
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
              color: '#d32f2f',
              transition: 'background-color 0.2s ease, border-color 0.2s ease',
            }}
            title="Clear Chat"
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#ffe0e0')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff3f3')}
          >
            <Trash2 size={16} />
            Clear
          </button>
          <button
            onClick={exportChat}
            style={{
              padding: '8px 12px',
              backgroundColor: '#f3f8ff',
              border: '1px solid #cdd8ff',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '14px',
              color: '#2196F3',
              transition: 'background-color 0.2s ease, border-color 0.2s ease',
            }}
            title="Export Chat"
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e0ecff')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f3f8ff')}
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          backgroundColor: '#fafafa',
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
                wordBreak: 'break-word',
                lineHeight: '1.4'
              }}
            >
              <div style={{ whiteSpace: 'pre-wrap' }}>{message.content}</div>
              <div
                style={{
                  fontSize: '11px',
                  opacity: 0.8, // Slightly higher opacity for timestamp
                  marginTop: '4px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: message.type === 'user' ? 'rgba(255,255,255,0.9)' : '#666'
                }}
              >
                <span>{formatTime(message.timestamp)}</span>
                <button
                  onClick={() => copyMessage(message.content)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    opacity: 0.7, // Slightly higher opacity for copy button
                    padding: '2px',
                    display: 'flex', // To center icon
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: message.type === 'user' ? 'white' : '#666',
                    transition: 'opacity 0.2s ease',
                  }}
                  title="Copy message"
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
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
        {isTyping && ( // Use local isTyping for the indicator
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
            placeholder="Type your message here... (e.g., 'Create a rule that sends email when order total > $100')"
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
              fontFamily: 'inherit',
              boxSizing: 'border-box' // Include padding in element's total width and height
            }}
            rows={1}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping} // Disable if input is empty or AI is typing
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
              transition: 'background-color 0.3s ease',
            }}
          >
            <Send size={20} color="white" />
          </button>
        </div>
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

export default ChatbotDashboard;
