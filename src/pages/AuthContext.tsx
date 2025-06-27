// src/pages/AuthContext.tsx
import React, { createContext, useContext } from 'react';
import { keycloak } from '../keycloak.ts'; // <-- this must resolve!

export const AuthContext = createContext({ keycloak });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => (
  <AuthContext.Provider value={{ keycloak }}>
    {children}
  </AuthContext.Provider>
);

export const useAuth = () => useContext(AuthContext);
