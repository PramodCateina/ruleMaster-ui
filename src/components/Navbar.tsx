import { useState, useEffect } from 'react';
import { keycloak } from '../keycloak';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!keycloak?.authenticated);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      if (!keycloak.authenticated) {
        await keycloak.init({ onLoad: 'check-sso', silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html` });
      }
      setIsAuthenticated(!!keycloak.authenticated);
    };

    checkAuth();

    // Listen to auth changes
    keycloak.onAuthSuccess = () => setIsAuthenticated(true);
    keycloak.onAuthLogout = () => setIsAuthenticated(false);
  }, []);

  const handleLogout = () => {
    keycloak.logout({ redirectUri: window.location.origin });
  };

  return (
    <nav className="navbar">
      <div className="navbar-left" onClick={() => navigate('/')}>
        PersonaPost AI
      </div>
      <div className="navbar-right">
        {isAuthenticated ? (
          <button className="nav-btn" onClick={handleLogout}>Logout</button>
        ) : (
          <button className="nav-btn" onClick={() => keycloak.login()}>Login</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
