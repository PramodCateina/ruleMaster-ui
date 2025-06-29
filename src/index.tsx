import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { keycloak, initKeycloak } from './keycloak.ts';
import './index.css';

const Root = () => {
  const [keycloakReady, setKeycloakReady] = useState(false);

  console.log("setKeycloakReadysetKeycloakReady",keycloakReady);
  

  useEffect(() => {
    initKeycloak()
      .then(() => setKeycloakReady(true))
      .catch(err => console.error('Keycloak Init Error:', err));
  }, []);

  if (!keycloakReady) return <div>Loading...</div>;

  if (keycloakReady){
    return (
    <BrowserRouter>
      <App keycloak={keycloak} />
    </BrowserRouter>
  );
  }

  
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<Root />);