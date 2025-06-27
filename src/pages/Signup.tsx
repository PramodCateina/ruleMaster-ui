import React, { useState } from 'react';
import './Auth.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    mobile: '',
    password: '',
  });

  const navigate = useNavigate(); // ✅ Moved up before handleSubmit

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post('http://localhost:4001/register', formData);
          // localStorage.setItem('userEmail', formData.email);
localStorage.setItem('userId', res.data.userId); // ✅ Store this
localStorage.setItem('userEmail', res.data.email);
      Swal.fire({
      icon: 'success',
      title: 'User created!',
      text: 'User has been created successfully.',
      showConfirmButton: false,
      timer: 1800,
      timerProgressBar: true,
      backdrop: true,
      position: 'top-end',
      toast: true,
    });

    setTimeout(() => {

      navigate('/suggestions'); // or window.location.href = '/login';
    }, 2000);
  } catch (error) {
   
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Error creating user. Please try again.',
    });
  }
};
 
  return (
    <div className="auth-container">
      <h1>Create Your Account</h1>
      
      <input name="email" type="email" placeholder="Email" onChange={handleChange} />
      <input name="firstName" type="text" placeholder="First Name" onChange={handleChange} />
      <input name="lastName" type="text" placeholder="Last Name" onChange={handleChange} />
      <input name="mobile" type="text" placeholder="Mobile Number" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} />

      <button className="primary-btn" style={{width: '106%'}} onClick={handleSubmit}>Continue</button>
      <p>Already have an account? <a href="/login">Log in</a></p>
    </div>
  );
}


