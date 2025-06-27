<div className="navbar">
  <div className="navbar-left">PersonaPost AI</div>
  <div className="navbar-right">
    <div className="dropdown">
      <button className="dropdown-toggle">Account</button>
      <div className="dropdown-menu">
        <div className="dropdown-email">{localStorage.getItem('email')}</div>
        <button className="dropdown-item" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  </div>
</div>
