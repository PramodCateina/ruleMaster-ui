import React, { useState } from 'react';

export default function UserRegistration() {
  const [showDialog, setShowDialog] = useState(false); // Controls dialog visibility
  const [users, setUsers] = useState([]); // Stores all registered users
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    mobile: '',
    password: '',
    group: '',
    role: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openDialog = () => {
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
    // Reset form data when closing dialog
    setFormData({
      email: '',
      firstName: '',
      lastName: '',
      mobile: '',
      password: '',
      group: '',
      role: '',
    });
  };

  const handleSubmit = async () => {
    try {
      // Basic validation: Check if required fields are filled
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.mobile || !formData.group || !formData.role) {
        alert('Please fill in all required fields.');
        return;
      }

      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        mobile: formData.mobile,
        group: formData.group,
        role: formData.role,
      };

      // Simulate API call
      console.log('Submitting data:', payload);
      
      // Simulate successful response
      const mockResponse = {
        userId: 'USER_' + Date.now(),
        email: payload.email,
        status: 'success'
      };

      // Create new user data
      const newUser = {
        ...payload,
        userId: mockResponse.userId,
        createdAt: new Date().toLocaleString()
      };

      // Add new user to the users array
      setUsers(prevUsers => [...prevUsers, newUser]);

      // Close dialog and show success
      setShowDialog(false);
      alert('User has been created successfully!');

      // Reset form data
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        mobile: '',
        password: '',
        group: '',
        role: '',
      });

    } catch (error) {
      console.error('Registration error:', error);
      alert('Error creating user. Please try again.');
    }
  };

  // CSS styles
  const mainContainerStyle: React.CSSProperties = {
    width: '100%',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f8f9fa',
    padding: '20px'
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  };

  const titleStyle: React.CSSProperties = {
    color: '#333',
    margin: 0,
    fontSize: '28px'
  };

  const registerButtonStyle: React.CSSProperties = {
    padding: '12px 24px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    fontWeight: '500'
  };

  const tableContainerStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden'
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse'
  };

  const cellStyle: React.CSSProperties = {
    padding: '15px 12px',
    textAlign: 'left',
    borderBottom: '1px solid #e9ecef'
  };

  const headerCellStyle: React.CSSProperties = {
    ...cellStyle,
    backgroundColor: '#f8f9fa',
    fontWeight: 'bold',
    borderBottom: '2px solid #dee2e6',
    color: '#495057'
  };

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  };

  const dialogStyle: React.CSSProperties = {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
    width: '500px',
    maxWidth: '90%',
    maxHeight: '90vh',
    overflowY: 'auto'
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '14px',
    boxSizing: 'border-box'
  };

  const buttonStyle: React.CSSProperties = {
    width: '30%',
    padding: '12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    marginBottom: '10px'
  };

  const cancelButtonStyle: React.CSSProperties = {
    width: '30%',
    padding: '12px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  };

  const dialogTitleStyle: React.CSSProperties = {
    color: '#333',
    textAlign: 'center',
    marginBottom: '20px',
    marginTop: 0
  };

  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '40px',
    color: '#6c757d'
  };

  return (
    <>
      <div style={mainContainerStyle}>
        {/* Header with title and register button */}
        <div style={headerStyle}>
          <h1 style={titleStyle}>User Management</h1>
          <button 
            style={registerButtonStyle}
            onClick={openDialog}
            onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
          >
            + Register New User
          </button>
        </div>

        {/* Users Table */}
        <div style={tableContainerStyle}>
          {users.length === 0 ? (
            <div style={emptyStateStyle}>
              <h3>No users registered yet</h3>
              <p>Click "Register New User" to add your first user.</p>
            </div>
          ) : (
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={headerCellStyle}>User ID</th>
                  <th style={headerCellStyle}>First Name</th>
                  <th style={headerCellStyle}>Last Name</th>
                  <th style={headerCellStyle}>Email</th>
                  <th style={headerCellStyle}>Mobile</th>
                  <th style={headerCellStyle}>Group</th>
                  <th style={headerCellStyle}>Role</th>
                  <th style={headerCellStyle}>Created At</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.userId} style={index % 2 === 0 ? {} : {backgroundColor: '#f8f9fa'}}>
                    <td style={cellStyle}>{user.userId}</td>
                    <td style={cellStyle}>{user.firstName}</td>
                    <td style={cellStyle}>{user.lastName}</td>
                    <td style={cellStyle}>{user.email}</td>
                    <td style={cellStyle}>{user.mobile}</td>
                    <td style={cellStyle}>{user.group}</td>
                    <td style={cellStyle}>{user.role}</td>
                    <td style={cellStyle}>{user.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Registration Form Dialog */}
      {showDialog && (
        <div style={overlayStyle} onClick={closeDialog}>
          <div style={dialogStyle} onClick={(e) => e.stopPropagation()}>
            <h2 style={dialogTitleStyle}>Create New User</h2>
            
            <input 
              name="firstName" 
              type="text" 
              placeholder="First Name *" 
              onChange={handleChange} 
              value={formData.firstName}
              style={inputStyle}
            />
            <input 
              name="lastName" 
              type="text" 
              placeholder="Last Name *" 
              onChange={handleChange} 
              value={formData.lastName}
              style={inputStyle}
            />
            <input 
              name="email" 
              type="email" 
              placeholder="Email *" 
              onChange={handleChange} 
              value={formData.email}
              style={inputStyle}
            />
            <input 
              name="mobile" 
              type="text" 
              placeholder="Mobile Number *" 
              onChange={handleChange} 
              value={formData.mobile}
              style={inputStyle}
            />
            <select 
              name="group" 
              onChange={handleChange} 
              value={formData.group} 
              style={inputStyle}
            >
              <option value="">Select Group *</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="guest">Guest</option>
            </select>
            <select 
              name="role" 
              onChange={handleChange} 
              value={formData.role} 
              style={inputStyle}
            >
              <option value="">Select Role *</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="guest">Guest</option>
            </select>
            
           <div style={{textAlign: 'right'}}>
          <button style={buttonStyle} onClick={handleSubmit} onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'} onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}>Submit</button>
          <button style={{...cancelButtonStyle, marginLeft: '10px'}} onClick={closeDialog} onMouseOver={(e) => e.target.style.backgroundColor = '#545b62'} onMouseOut={(e) => e.target.style.backgroundColor = '#6c757d'}>Cancel</button>
        </div>
          </div>
        </div>
      )}
    </>
  );
}