import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard.tsx';
import Login from './pages/Login.tsx';
import './App.css';
import Signup from './pages/Signup.tsx';
import RealmCreation from './pages/RealmCreation.tsx';
import Suggestions from './pages/Suggestions.tsx';
import CreateUserForm from './pages/user-registration.tsx';
import ChatbotScreen from './pages/chatbot.tsx';

const App = ({ keycloak }: { keycloak: any }) => {
  const isLoggedIn = keycloak.authenticated;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const publicPaths = ['/login', '/signup'];
    const username = keycloak?.tokenParsed?.preferred_username;

    if (!username && !publicPaths.includes(location.pathname)) {
      keycloak.login();
    }
  }, [keycloak, location.pathname]);

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-left" onClick={() => navigate('/')}>Rule master</div>
        <div className="navbar-right">
          {isLoggedIn ? (
            <>
              <button className="nav-button" onClick={() => navigate('/realmcreation')}>
                Tenant creation
              </button>
              <span className="username">
                {keycloak.tokenParsed?.preferred_username}
              </span>
              <button className="nav-button" onClick={() => keycloak.logout()}>
                Logout
              </button>
            </>
          ) : (
            <button className="nav-button" onClick={() => keycloak.login()}>
              Login
            </button>
          )}
        </div>
      </nav>

      {/* Routing */}
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/user-registration" element={<CreateUserForm />} />
        <Route path="/realmcreation" element={<RealmCreation />} />
        <Route path="/chatbotScreen" element={<ChatbotScreen />} />
        <Route path="/login" element={<Login />} />
        <Route path="/suggestions" element={<Suggestions />} />
        <Route path="/dashboard" element={<Dashboard keycloak={keycloak} />} />
        <Route path="*" element={<Dashboard keycloak={keycloak} />} />
      </Routes>
    </div>
  );
};

export default App;
