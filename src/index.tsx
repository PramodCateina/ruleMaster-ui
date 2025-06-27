// import { useState, useEffect } from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App';
// import React from 'react';
// import { keycloak, initKeycloak } from './keycloak';
// import { BrowserRouter } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const Root = () => {
//   const [keycloakReady, setKeycloakReady] = useState(false);

//   useEffect(() => {
//     initKeycloak()
//       .then(() => setKeycloakReady(true))
//       .catch(err => console.error('Keycloak Init Error:', err));
//   }, []);

//   if (!keycloakReady) return <div>Loading...</div>;

//   return <App />;
// };

// const root = ReactDOM.createRoot(document.getElementById('root')!);
// root.render(

//     <BrowserRouter>
//       <App />
//     </BrowserRouter>

// );
// src/index.tsx
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { keycloak, initKeycloak } from './keycloak.ts';
import './index.css';

const Root = () => {
  const [keycloakReady, setKeycloakReady] = useState(false);

  useEffect(() => {
    initKeycloak()
      .then(() => setKeycloakReady(true))
      .catch(err => console.error('Keycloak Init Error:', err));
  }, []);

  if (!keycloakReady) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <App keycloak={keycloak} />
    </BrowserRouter>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<Root />);

// import React from 'react';

// import ReactDOM from 'react-dom/client';
// import { BrowserRouter } from 'react-router-dom';
// import App from './App';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import {keycloak} from './keycloak';



// keycloak
//   .init({ onLoad: 'login-required' })
//   .then((authenticated) => {
//     if (authenticated) {
//       const root = ReactDOM.createRoot(document.getElementById('root')!);
//       root.render(
//         <BrowserRouter>
//           <App keycloak={keycloak} />
//         </BrowserRouter>
//       );
//     } else {
//       window.location.reload();
//     }
//   })
//   .catch((err) => {
//     console.error('Keycloak init failed', err);
//   });
