// import React, { useState } from 'react';
// import './Suggestions.css'; 
// import { useNavigate } from 'react-router-dom';

// export default function Suggestions() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     profession: '',
//     hobbies: '',
//     interests: '',
//     contentThemes: '',
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = () => {
//     // You can store or process this data if needed
//     console.log('User Preferences:', formData);
//     navigate('/dashboard'); // Redirect to dashboard
//   };

//   return (
//     <div className="suggestions-container">
//       <h2>Tell us about yourself</h2>
//       <input name="profession" placeholder="Your Profession" onChange={handleChange} />
//       <input name="hobbies" placeholder="Your Hobbies" onChange={handleChange} />
//       <input name="interests" placeholder="Your Interests" onChange={handleChange} />
//       <input name="contentThemes" placeholder="Preferred Content Themes" onChange={handleChange} />
//       <button onClick={handleSubmit}>Continue to Dashboard</button>
//     </div>
//   );
// }


import React, { useState } from 'react';
import './Suggestions.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Suggestions() {
  const navigate = useNavigate();

  // This should ideally come from authentication context (e.g., Keycloak)
 
const email = localStorage.getItem('userEmail');
  const [formData, setFormData] = useState({
    name: '',
    profession: '',
    hobbies: '',
    interests: '',
    preferred_content_themes: '',
    preferred_tone: '',
   
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
const userId = localStorage.getItem('userId');
 const handleSubmit = async () => {
  try {
    console.log('Submitting:', formData);
    const response = await axios.post(
      `http://localhost:4001/api/profile/create/${userId}`, // pass userId in URL
      formData
    );
    console.log('Profile created:', response.data);
    setTimeout(() => {

      navigate('/Login');
    }, 2000);
    
  } catch (error) {
    console.error('Error creating profile:', error);
    alert('Failed to create profile.');
  }
};

  return (
    <div className="suggestions-container">
      <h2>Tell us about yourself</h2>
      <input name="name" placeholder="Your Name" onChange={handleChange} />
      <input name="profession" placeholder="Your Profession" onChange={handleChange} />
      <input name="hobbies" placeholder="Your Hobbies" onChange={handleChange} />
      <input name="interests" placeholder="Your Interests" onChange={handleChange} />
      <input name="preferred_content_themes" placeholder="Preferred Content Themes" onChange={handleChange} />
      <input name="preferred_tone" placeholder="Preferred Tone (e.g., Casual, Formal)" onChange={handleChange} />
      <button onClick={handleSubmit}>Continue to Dashboard</button>
    </div>
  );
}
