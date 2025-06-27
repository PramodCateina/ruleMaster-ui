// src/pages/Login.tsx
import React, { useState } from 'react';
import './Auth.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { keycloak } from '../keycloak.ts';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      keycloak.login();

      // localStorage.setItem('access_token', response.data.access_token);
      // localStorage.setItem('refresh_token', response.data.refresh_token);
      // localStorage.setItem('id_token', response.data.id_token);
      // localStorage.setItem('expires_in', response.data.expires_in);
      // localStorage.setItem('firstName', response.data.firstName);
      // localStorage.setItem('email', response.data.email);


      // console.log('response : ', response.data);


      Swal.fire({
        icon: 'success',
        title: 'Logged in!',
        text: 'You have been successfully logged in.',
        showConfirmButton: false,
        timer: 1800,
        timerProgressBar: true,
        backdrop: true,
        position: 'top-end',
        toast: true,
      });

      setTimeout(() => {
        navigate('/dashboard'); // or window.location.href = '/login';
      }, 2000);
    } catch (error) {
      console.error('Login failed:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Login failed. Please try again.',
      });
    }
  };

  return (
    <div className="auth-container">
      <h1>Welcome Back</h1>
      
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="primary-btn" style={{width: '106%'}} onClick={handleLogin}>Continue</button>
      <p>Don’t have an account? <a href="/signup">Sign up</a></p>
    </div>
  );
}
