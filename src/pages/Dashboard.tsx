import React, { useState } from 'react';
import UserRegistration from './user-registration.tsx'; // Adjust the path as needed
import ChatbotScreen from './chatbot.tsx';

const mockKeycloak = {
  token: 'mock-token',
  tokenParsed: {
    given_name: 'John'
  }
};

interface Tenant {
  id: number;
  name: string;
  createdAt: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: string;
}

const Dashboard = ({ keycloak = mockKeycloak }: { keycloak?: any }) => {
  const [activeNav, setActiveNav] = useState<string>('tenants');
  const [tenants, setTenants] = useState<Tenant[]>([
    { id: 1, name: 'Innovate Inc.', createdAt: '15/01/2023' },
    { id: 2, name: 'Quantum Solutions', createdAt: '20/02/2023' },
    { id: 3, name: 'Apex Logistics', createdAt: '10/03/2023' },
  ]);

  const navItems: NavItem[] = [
    { id: 'tenants', label: 'Tenants', icon: '👥' },
    { id: 'group', label: 'Grpups', icon: '👥' },
    { id: 'roles', label: 'Roles', icon: '👥' },
    { id: 'users', label: 'Users', icon: '👤' },
    { id: 'rules', label: 'Rules', icon: '📋' },
    { id: 'functions', label: 'Custom Functions', icon: '⚙️' },
  ];

  const handleNavClick = (navId: string) => {
    setActiveNav(navId);
  };

  const handleAddTenant = () => {
    const tenantName = prompt('Enter tenant name:');
    if (tenantName && tenantName.trim()) {
      const newTenant: Tenant = {
        id: Date.now(),
        name: tenantName.trim(),
        createdAt: new Date().toLocaleDateString('en-GB'),
      };
      setTenants(prev => [...prev, newTenant]);
    }
  };

  const handleAddUser = () => {
  // Just scroll to the signup form
  const signupForm = document.querySelector('.content-card');
  if (signupForm) {
    signupForm.scrollIntoView({ behavior: 'smooth' });
  }
};

  const handleTenantAction = (tenant: Tenant) => {
    const actions = ['Edit', 'Delete', 'View Details', 'Export Data'];
    const actionChoice = prompt(
      `Actions for ${tenant.name}:\n\n${actions.map((a, i) => `${i + 1}. ${a}`).join('\n')}\n\nEnter action number:`
    );

    const actionIndex = parseInt(actionChoice || '') - 1;
    if (actionIndex >= 0 && actionIndex < actions.length) {
      const selectedAction = actions[actionIndex];
      
      if (selectedAction === 'Delete') {
        if (window.confirm(`Are you sure you want to delete ${tenant.name}?`)) {
          setTenants(prev => prev.filter(t => t.id !== tenant.id));
        }
      } else {
        alert(`${selectedAction} action selected for ${tenant.name}`);
      }
    }
  };

  const getCurrentPageTitle = () => {
    const currentNav = navItems.find(item => item.id === activeNav);
    return currentNav ? currentNav.label : 'Dashboard';
  };

  return (
    <div className="dashboard-container">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .dashboard-container {
          display: flex;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          background-color: #f5f6fa;
          color: #333;
        }

        .sidebar {
          width: 280px;
          background-color: #2c3e50;
          color: white;
          box-shadow: 2px 0 5px rgba(0,0,0,0.1);
        }

        .sidebar-header {
          padding: 20px;
          border-bottom: 1px solid #34495e;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 16px;
        }

        .sidebar-title {
          font-size: 18px;
          font-weight: 600;
        }

        .sidebar-nav {
          padding: 20px 0;
        }

        .nav-item {
          display: flex;
          align-items: center;
          padding: 12px 20px;
          color: #bdc3c7;
          cursor: pointer;
          transition: all 0.3s ease;
          border-left: 3px solid transparent;
        }

        .nav-item:hover {
          background-color: #34495e;
          color: white;
        }

        .nav-item.active {
          background-color: #34495e;
          color: white;
          border-left-color: #667eea;
        }

        .nav-icon {
          width: 20px;
          height: 20px;
          margin-right: 12px;
          opacity: 0.8;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .main-content {
          flex: 1;
        }

        .top-bar {
          background: white;
          padding: 20px 30px;
          border-bottom: 1px solid #e1e8ed;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .page-title {
          font-size: 28px;
          font-weight: 600;
          color: #2c3e50;
        }

        .add-tenant-btn {
          background: #667eea;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .add-tenant-btn:hover {
          background: #5a6fd8;
        }

        .content-area {
          padding: 30px;
        }

        .content-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          overflow: hidden;
        }

        .card-header {
          padding: 20px 25px;
          border-bottom: 1px solid #e1e8ed;
        }

        .card-title {
          font-size: 20px;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 5px;
        }

        .card-subtitle {
          color: #7f8c8d;
          font-size: 14px;
        }

        .table-container {
          overflow-x: auto;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table th {
          background-color: #f8f9fa;
          padding: 15px 25px;
          text-align: left;
          font-weight: 500;
          color: #5a6c7d;
          font-size: 14px;
          border-bottom: 1px solid #e1e8ed;
        }

        .data-table td {
          padding: 18px 25px;
          border-bottom: 1px solid #f1f3f4;
          color: #2c3e50;
        }

        .data-table tr:hover {
          background-color: #f8f9fa;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .tenant-name {
          font-weight: 500;
          color: #2c3e50;
        }

        .created-date {
          color: #5a6c7d;
        }

        .actions-btn {
          background: none;
          border: none;
          color: #7f8c8d;
          font-size: 18px;
          cursor: pointer;
          padding: 5px;
          border-radius: 4px;
          transition: all 0.3s ease;
        }

        .actions-btn:hover {
          background-color: #f1f3f4;
          color: #2c3e50;
        }

        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: #7f8c8d;
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 250px;
          }
          
          .content-area {
            padding: 20px;
          }
          
          .top-bar {
            padding: 15px 20px;
          }
          
          .page-title {
            font-size: 24px;
          }
        }
      `}</style>

      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo">📦</div>
          <h1 className="sidebar-title">RuleMaster AI</h1>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <div
              key={item.id}
              className={`nav-item ${activeNav === item.id ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              <div className="nav-icon">{item.icon}</div>
              {item.label}
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
  <div className="top-bar">
    <h1 className="page-title">{getCurrentPageTitle()}</h1>
    {/* {activeNav === 'tenants' && (
      <button className="add-tenant-btn" onClick={handleAddTenant}>
        <span>➕</span>
        Add Tenant
      </button>
    )} */}
    {/* {activeNav === 'users' && (
      <button className="add-tenant-btn" onClick={handleAddUser}>
        <span>➕</span>
        Add User
      </button>
    )} */}
  </div>

  <div className="content-area">
    {activeNav === 'tenants' ? (
      <div className="content-card">
        <div className="card-header">
          <h2 className="card-title">All Tenants</h2>
          <p className="card-subtitle">A list of all B2B clients in the system.</p>
        </div>
        
        <div className="table-container">
          {tenants.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map((tenant) => (
                  <tr key={tenant.id}>
                    <td className="tenant-name">{tenant.name}</td>
                    <td className="created-date">{tenant.createdAt}</td>
                    <td>
                      <button
                        className="actions-btn"
                        onClick={() => handleTenantAction(tenant)}
                      >
                        ⋯
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <p>No tenants found. Click "Add Tenant" to get started.</p>
            </div>
          )}
        </div>
      </div>
    ) : activeNav === 'users' ? (
      <UserRegistration />
    ) : activeNav === 'rules' ? (
      <ChatbotScreen />
    ):(
      <div className="content-card">
        <div className="card-header">
          <h2 className="card-title">{getCurrentPageTitle()}</h2>
          <p className="card-subtitle">This section is coming soon...</p>
        </div>
        <div style={{ padding: '40px 25px', textAlign: 'center', color: '#7f8c8d' }}>
          <p>🚧 Under Construction</p>
          <p style={{ marginTop: '10px', fontSize: '14px' }}>
            The {getCurrentPageTitle()} section will be available soon.
          </p>
        </div>
      </div>
    )}
  </div>
</div>
    </div>
  );
};

export default Dashboard;