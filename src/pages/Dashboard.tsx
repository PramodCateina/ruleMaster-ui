import React, { useState, useEffect } from 'react';
import ChatbotScreen from './chatbot.tsx'

// Mock data and interfaces
const mockKeycloak = {
  token: 'mock-token',
  tokenParsed: {
    given_name: 'John'
  }
};

interface Tenant {
  realmId: string;
  name: string;
  createdAt: string;
}

interface User {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  group: string;
  role: string;
  createdAt: string;
}

interface Group {
  id: number;
  name: string;
  description: string;
  tenantId: number; // Added tenantId to Group interface
  createdAt: string;
}

interface Role {
  id: number;
  name: string;
  description: string;
  groupId: number; // Added groupId to Role interface
  tenantId: number; // Added tenantId to Role interface
  createdAt: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: string;
}

// Mock ChatbotScreen Component (remains the same)
// const ChatbotScreen = () => (
//   <div className="content-card">
//     <div className="card-header">
//       <h2 className="card-title">Rules Chatbot</h2>
//       <p className="card-subtitle">Interactive rules management</p>
//     </div>
//     <div style={{ padding: '25px' }}>
//       <p>Chatbot interface would go here...</p>
//     </div>
//   </div>
// );

// Generic Input Dialog Component (for single-field inputs like Tenant)
const InputDialog = ({
  isOpen,
  onClose,
  onSave,
  title,
  label,
  placeholder,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  // Reset input and error when dialog opens or closes
  useEffect(() => {
    if (isOpen) {
      setInputValue('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!inputValue.trim()) {
      setError(`${label} is required`);
      return;
    }

    onSave(inputValue.trim());
    setInputValue('');
    setError('');
    onClose();
  };

  const handleClose = () => {
    setInputValue('');
    setError('');
    onClose();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay" onClick={handleClose}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2 className="dialog-title">{title}</h2>
          <button className="dialog-close" onClick={handleClose}>
            ✕
          </button>
        </div>

        <div className="dialog-body">
          <div className="form-group">
            <label htmlFor="dialogInput" className="form-label">
              {label}
            </label>
            <input
              type="text"
              id="dialogInput"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              className="form-input"
              placeholder={placeholder}
              autoFocus
            />
            {error && <p className="error-message">{error}</p>}
          </div>

          <div className="dialog-actions">
            <button type="button" onClick={handleClose} className="btn-secondary">
              Cancel
            </button>
            <button type="button" onClick={handleSubmit} className="btn-primary">
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


// UserRegistrationDialog Component - Multi-field dialog for user registration
const UserRegistrationDialog = ({ isOpen, onClose, onRegisterUser }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [group, setGroup] = useState(''); // Default group or fetch from options
  const [role, setRole] = useState('');   // Default role or fetch from options

  const [errors, setErrors] = useState({});

  // Mock options for Group and Role (in a real app, these would come from API)
  const groupOptions = ['Admin', 'Users', 'Support', 'Developers'];
  const roleOptions = ['Administrator', 'Manager', 'User', 'Viewer'];

  // Reset form fields and errors when dialog opens
  useEffect(() => {
    if (isOpen) {
      setFirstName('');
      setLastName('');
      setEmail('');
      setMobile('');
      setGroup('');
      setRole('');
      setErrors({});
    }
  }, [isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!firstName.trim()) newErrors.firstName = 'First Name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last Name is required';
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email address is invalid';
    }
    if (!mobile.trim()) newErrors.mobile = 'Mobile number is required';
    if (!group) newErrors.group = 'Group is required';
    if (!role) newErrors.role = 'Role is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const newUser = {
        userId: `USR${Date.now().toString().slice(-6)}`, // Generate a mock user ID
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
        group: group,
        role: role,
        createdAt: new Date().toLocaleDateString('en-GB'),
      };
      onRegisterUser(newUser);
      onClose(); // Close dialog on successful registration
    }
  };

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}> {/* Increased max-width for more fields */}
        <div className="dialog-header">
          <h2 className="dialog-title">Register New User</h2>
          <button className="dialog-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="dialog-body">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="regFirstName" className="form-label">First Name</label>
                <input
                  type="text"
                  id="regFirstName"
                  className={`form-input ${errors.firstName ? 'error' : ''}`}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter first name"
                  autoFocus
                />
                {errors.firstName && <p className="error-message">{errors.firstName}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="regLastName" className="form-label">Last Name</label>
                <input
                  type="text"
                  id="regLastName"
                  className={`form-input ${errors.lastName ? 'error' : ''}`}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter last name"
                />
                {errors.lastName && <p className="error-message">{errors.lastName}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="regEmail" className="form-label">Email</label>
                <input
                  type="email"
                  id="regEmail"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                />
                {errors.email && <p className="error-message">{errors.email}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="regMobile" className="form-label">Mobile</label>
                <input
                  type="tel"
                  id="regMobile"
                  className={`form-input ${errors.mobile ? 'error' : ''}`}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Enter mobile number"
                />
                {errors.mobile && <p className="error-message">{errors.mobile}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="regGroup" className="form-label">Group</label>
                <select
                  id="regGroup"
                  className={`form-input ${errors.group ? 'error' : ''}`}
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                >
                  <option value="">Select a group</option>
                  {groupOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                {errors.group && <p className="error-message">{errors.group}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="regRole" className="form-label">Role</label>
                <select
                  id="regRole"
                  className={`form-input ${errors.role ? 'error' : ''}`}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="">Select a role</option>
                  {roleOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                {errors.role && <p className="error-message">{errors.role}</p>}
              </div>
            </div>
          </div>
          <div className="dialog-actions" style={{ padding: '0 25px 25px', marginTop: '0' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Register User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// GroupDialog Component - New multi-field dialog for group creation with tenant dropdown

const GroupDialog = ({ isOpen, onClose, onSaveGroup }) => {
  const [groupName, setGroupName] = useState('');
  const [selectedTenantId, setSelectedTenantId] = useState('');
  const [tenants, setTenants] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // API call to fetch tenants
  const admin_id = localStorage.getItem("userId")
  const fetchTenants = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:4002/api/realm/getRealm/${admin_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const tenants = data.data

      console.log("datadatadata",data.data);
      
      setTenants(data.data);
    } catch (error) {
      console.error('Error fetching tenants:', error);
      setErrors(prev => ({ ...prev, tenants: 'Failed to load tenants' }));
    } finally {
      setLoading(false);
    }
  };

  // Reset form and fetch tenants when dialog opens
  useEffect(() => {
    if (isOpen) {
      setGroupName('');
      setSelectedTenantId('');
      setErrors({});
      fetchTenants();
    }
  }, [isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!groupName.trim()) newErrors.groupName = 'Group Name is required';
    if (!selectedTenantId) newErrors.selectedTenantId = 'Tenant is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSaveGroup(groupName.trim(), parseInt(selectedTenantId));
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <div className="dialog-header">
          <h2 className="dialog-title">Create New Group</h2>
          <button className="dialog-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="dialog-body">
            <div className="form-group">
              <label htmlFor="groupName" className="form-label">Group Name</label>
              <input
                type="text"
                id="groupName"
                className={`form-input ${errors.groupName ? 'error' : ''}`}
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter group name"
                autoFocus
              />
              {errors.groupName && <p className="error-message">{errors.groupName}</p>}
            </div>
            
            <div className="form-group">
              <label htmlFor="groupTenant" className="form-label">Tenant</label>
              <select
                id="groupTenant"
                className={`form-input ${errors.selectedTenantId ? 'error' : ''}`}
                value={selectedTenantId}
                onChange={(e) => setSelectedTenantId(e.target.value)}
                disabled={loading}
              >
                <option value="">
                  {loading ? 'Loading tenants...' : 'Select a tenant'}
                </option>
                {tenants.map(tenant => (
                  <option key={tenant.id} value={tenant.id}>
                    {tenant.name}
                  </option>
                ))}
              </select>
              {errors.selectedTenantId && <p className="error-message">{errors.selectedTenantId}</p>}
              {errors.tenants && <p className="error-message">{errors.tenants}</p>}
            </div>
          </div>
          
          <div className="dialog-actions" style={{ padding: '0 25px 25px', marginTop: '0' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Loading...' : 'Create Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};




// RoleDialog Component - New multi-field dialog for role creation with group and tenant dropdowns
const RoleDialog = ({ isOpen, onClose, onSaveRole }) => {
  const [roleName, setRoleName] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [selectedTenantId, setSelectedTenantId] = useState('');
  const [groups, setGroups] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState({
    groups: false,
    tenants: false
  });

    const admin_id = localStorage.getItem("userId")


  // API call to fetch groups
  const fetchGroups = async () => {
    try {
      setLoading(prev => ({ ...prev, groups: true }));
      const response = await fetch(`http://localhost:4002/api/groups/getGroups/${admin_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setGroups(data.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
      setErrors(prev => ({ ...prev, groups: 'Failed to load groups' }));
    } finally {
      setLoading(prev => ({ ...prev, groups: false }));
    }
  };

  // API call to fetch tenants
  const fetchTenants = async () => {
    try {
      setLoading(prev => ({ ...prev, tenants: true }));
      const response =  await fetch(`http://localhost:4002/api/realm/getRealm/${admin_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTenants(data.data);
    } catch (error) {
      console.error('Error fetching tenants:', error);
      setErrors(prev => ({ ...prev, tenants: 'Failed to load tenants' }));
    } finally {
      setLoading(prev => ({ ...prev, tenants: false }));
    }
  };

  // Fetch both groups and tenants in parallel
  const fetchData = async () => {
    await Promise.all([fetchGroups(), fetchTenants()]);
  };

  // Reset form and fetch data when dialog opens
  useEffect(() => {
    if (isOpen) {
      setRoleName('');
      setSelectedGroupId('');
      setSelectedTenantId('');
      setErrors({});
      setGroups([]);
      setTenants([]);
      fetchData();
    }
  }, [isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!roleName.trim()) newErrors.roleName = 'Role Name is required';
    if (!selectedGroupId) newErrors.selectedGroupId = 'Group is required';
    if (!selectedTenantId) newErrors.selectedTenantId = 'Tenant is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSaveRole(roleName.trim(), parseInt(selectedGroupId), parseInt(selectedTenantId));
      onClose();
    }
  };

  const isAnyLoading = loading.groups || loading.tenants;

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <div className="dialog-header">
          <h2 className="dialog-title">Create New Role</h2>
          <button className="dialog-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="dialog-body">
            <div className="form-group">
              <label htmlFor="roleName" className="form-label">Role Name</label>
              <input
                type="text"
                id="roleName"
                className={`form-input ${errors.roleName ? 'error' : ''}`}
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="Enter role name"
                autoFocus
              />
              {errors.roleName && <p className="error-message">{errors.roleName}</p>}
            </div>
            
            <div className="form-group">
              <label htmlFor="roleGroup" className="form-label">Group</label>
              <select
                id="roleGroup"
                className={`form-input ${errors.selectedGroupId ? 'error' : ''}`}
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
                disabled={loading.groups}
              >
                <option value="">
                  {loading.groups ? 'Loading groups...' : 'Select a group'}
                </option>
                {groups.map(group => (
                  <option key={group.id} value={group.id}>
                    {group.group_name}
                  </option>
                ))}
              </select>
              {errors.selectedGroupId && <p className="error-message">{errors.selectedGroupId}</p>}
              {errors.groups && <p className="error-message">{errors.groups}</p>}
            </div>
            
            <div className="form-group">
              <label htmlFor="roleTenant" className="form-label">Tenant</label>
              <select
                id="roleTenant"
                className={`form-input ${errors.selectedTenantId ? 'error' : ''}`}
                value={selectedTenantId}
                onChange={(e) => setSelectedTenantId(e.target.value)}
                disabled={loading.tenants}
              >
                <option value="">
                  {loading.tenants ? 'Loading tenants...' : 'Select a tenant'}
                </option>
                {tenants.map(tenant => (
                  <option key={tenant.id} value={tenant.id}>
                    {tenant.name}
                  </option>
                ))}
              </select>
              {errors.selectedTenantId && <p className="error-message">{errors.selectedTenantId}</p>}
              {errors.tenants && <p className="error-message">{errors.tenants}</p>}
            </div>
          </div>
          
          <div className="dialog-actions" style={{ padding: '0 25px 25px', marginTop: '0' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isAnyLoading}>
              {isAnyLoading ? 'Loading...' : 'Create Role'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ActionDropdown = ({ itemId, onEdit, onDelete, isOpen, onToggle }) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.actions-dropdown')) {
        onToggle(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen, onToggle]);

  return (
    <div className="actions-dropdown">
      <button
        className="actions-btn"
        onClick={(e) => {
          e.stopPropagation();
          onToggle(itemId);
        }}
      >
        ⋯
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          <button
            className="dropdown-item edit-item"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
              onToggle(null);
            }}
          >
            ✏️ Edit
          </button>
          <button
            className="dropdown-item delete-item"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
              onToggle(null);
            }}
          >
            🗑️ Delete
          </button>
        </div>
      )}
    </div>
  );
};

const Dashboard = ({ keycloak = mockKeycloak }) => {
  const [activeNav, setActiveNav] = useState('tenants');
  const [currentView, setCurrentView] = useState('dashboard');
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Dialog open states for different entities
  const [isTenantDialogOpen, setIsTenantDialogOpen] = useState(false);
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false); // Controlled by new RoleDialog
  const [isUserRegistrationDialogOpen, setIsUserRegistrationDialogOpen] = useState(false);

  // Data states
  const [tenants, setTenants] = useState([
    { id: 1, name: 'Innovate Inc.', createdAt: '15/01/2023' },
    { id: 2, name: 'Quantum Solutions', createdAt: '20/02/2023' },
    { id: 3, name: 'Apex Logistics', createdAt: '10/03/2023' },
  ]);
  

  const [users, setUsers] = useState([
    {
      userId: 'USR001',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      mobile: '+1234567890',
      group: 'Admin',
      role: 'Administrator',
      createdAt: '15/01/2023'
    },
    {
      userId: 'USR002',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      mobile: '+1234567891',
      group: 'Users',
      role: 'Manager',
      createdAt: '20/02/2023'
    }
  ]);

  const [groups, setGroups] = useState([
    { id: 101, name: 'Administrators', description: 'System administrators', tenantId: 1, createdAt: '01/01/2023' },
    { id: 102, name: 'Developers', description: 'Software developers', tenantId: 1, createdAt: '05/01/2023' },
    { id: 103, name: 'Sales Team', description: 'Quantum Solutions Sales', tenantId: 2, createdAt: '10/03/2024' },
  ]);

  const [roles, setRoles] = useState([
    { id: 201, name: 'Administrator', description: 'Full system access', groupId: 101, tenantId: 1, createdAt: '01/01/2023' },
    { id: 202, name: 'Editor', description: 'Content editing privileges', groupId: 102, tenantId: 1, createdAt: '10/01/2023' },
    { id: 203, name: 'Sales Rep', description: 'Manages sales activities', groupId: 103, tenantId: 2, createdAt: '15/03/2024' },
  ]);

  const navItems = [
    { id: 'tenants', label: 'Tenants', icon: '🏢' },
    { id: 'group', label: 'Groups', icon: '👥' },
    { id: 'roles', label: 'Roles', icon: '🎭' },
    { id: 'users', label: 'Users', icon: '👤' },
    { id: 'rules', label: 'Rules', icon: '📋' },
    { id: 'functions', label: 'Custom Functions', icon: '⚙️' },
  ];

  const handleNavClick = (navId) => {
    setActiveNav(navId);
    // Ensure any open dialogs are closed when navigating
    setIsTenantDialogOpen(false);
    setIsGroupDialogOpen(false);
    setIsRoleDialogOpen(false);
    setIsUserRegistrationDialogOpen(false);
    setCurrentView('dashboard'); // Always return to dashboard view on nav click
    setActiveDropdown(null);
  };

  // Generic handler to open appropriate dialog
  const handleAddItem = () => {
    switch (activeNav) {
      case 'tenants':
        setIsTenantDialogOpen(true);
        break;
      case 'users':
        setIsUserRegistrationDialogOpen(true);
        break;
      case 'group':
        setIsGroupDialogOpen(true);
        break;
      case 'roles':
        setIsRoleDialogOpen(true); // Open the new RoleDialog
        break;
      default:
        break;
    }
  };

  // Save functions for each entity
  const handleSaveTenant = async (name) => {
  const profileString = localStorage.getItem("userProfile");
   const userProfile = profileString ? JSON.parse(profileString) : undefined;
  const newTenant = {
    name,
    createdAt: new Date().toLocaleDateString('en-GB'),
    userDetails : userProfile
  };
  console.log("newTenantnewTenant",newTenant);
  
  
  console.log("newTenant", newTenant);
  
  try {
    const response = await fetch('http://localhost:4002/api/realm/createRealm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name, // or newTenant.name
        createdAt: newTenant.createdAt,
        userDetails:newTenant.userDetails
        // Add any other fields your API expects
      }),
    });

    console.log("responseresponseresponse",response);
    

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('API response:', result);
    
    // Update local state with the new tenant
    setTenants((prev) => [...prev, newTenant]); // Fixed: was missing 'prev'
    
    return result;
  } catch (error) {
    console.error('Error saving tenant:', error);
    // Handle error appropriately - maybe show a toast notification
    throw error;
  }
};

  const handleRegisterUser = (newUser) => {
    setUsers((prev) => [...prev, newUser]);
  };

  const handleSaveGroup = (name, tenantId) => {
    const newGroup = {
      id: Date.now(),
      name,
      description: `Description for ${name}`, // Add a default description
      tenantId: tenantId, // Assign the selected tenant ID
      createdAt: new Date().toLocaleDateString('en-GB'),
    };
    setGroups((prev) => [...prev, newGroup]);
  };

  const handleEditTenant = (tenant) => {
    alert(`Edit tenant: ${tenant.name}`);
    // Add edit logic here
  };

  const handleEditUser = (user) => {
    alert(`Edit user: ${user.firstName} ${user.lastName}`);
    // Add edit logic here
  };

  const handleEditGroup = (group) => {
    alert(`Edit group: ${group.name}`);
    // Add edit logic here
  };

  const handleEditRole = (role) => {
    alert(`Edit role: ${role.name}`);
    // Add edit logic here
  };

  // Delete handlers
  const handleDeleteTenant = (tenant) => {
    if (window.confirm(`Are you sure you want to delete ${tenant.name}?`)) {
      setTenants((prev) => prev.filter((t) => t.id !== tenant.id));
    }
  };

  const handleDeleteUser = (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
      setUsers((prev) => prev.filter((u) => u.userId !== user.userId));
    }
  };

  const handleDeleteGroup = (group) => {
    if (window.confirm(`Are you sure you want to delete ${group.name}?`)) {
      setGroups((prev) => prev.filter((g) => g.id !== group.id));
    }
  };

  const handleDeleteRole = (role) => {
    if (window.confirm(`Are you sure you want to delete ${role.name}?`)) {
      setRoles((prev) => prev.filter((r) => r.id !== role.id));
    }
  };

  // Updated handleSaveRole to accept name, groupId, and tenantId
  const handleSaveRole = (name, groupId, tenantId) => {
    const newRole = {
      id: Date.now(),
      name,
      description: `Description for ${name} role`, // Add a default description
      groupId: groupId,
      tenantId: tenantId,
      createdAt: new Date().toLocaleDateString('en-GB'),
    };
    setRoles((prev) => [...prev, newRole]);
  };

  const handleTenantAction = (tenant) => {
    const actions = ['Edit', 'Delete', 'View Details', 'Export Data'];
    const actionChoice = prompt(
      `Actions for ${tenant.name}:\n\n${actions.map((a, i) => `${i + 1}. ${a}`).join('\n')}\n\nEnter action number:`
    );

    const actionIndex = parseInt(actionChoice || '') - 1;
    if (actionIndex >= 0 && actionIndex < actions.length) {
      const selectedAction = actions[actionIndex];

      if (selectedAction === 'Delete') {
        if (window.confirm(`Are you sure you want to delete ${tenant.name}?`)) {
          setTenants((prev) => prev.filter((t) => t.id !== tenant.id));
        }
      } else {
        alert(`${selectedAction} action selected for ${tenant.name}`);
      }
    }
  };

  // Helper for generic "Actions" button
  const handleGenericAction = (item, type) => {
    const actions = ['Edit', 'Delete', 'View Details'];
    const actionChoice = prompt(
      `Actions for ${item.name || item.firstName} (${type}):\n\n${actions.map((a, i) => `${i + 1}. ${a}`).join('\n')}\n\nEnter action number:`
    );

    const actionIndex = parseInt(actionChoice || '') - 1;
    if (actionIndex >= 0 && actionIndex < actions.length) {
      const selectedAction = actions[actionIndex];

      if (selectedAction === 'Delete') {
        if (window.confirm(`Are you sure you want to delete ${item.name || item.firstName} (${type})?`)) {
          if (type === 'user') {
            setUsers((prev) => prev.filter((u) => u.userId !== item.userId));
          } else if (type === 'group') {
            setGroups((prev) => prev.filter((g) => g.id !== item.id));
          } else if (type === 'role') {
            setRoles((prev) => prev.filter((r) => r.id !== item.id));
          }
        }
      } else {
        alert(`${selectedAction} action selected for ${item.name || item.firstName} (${type})`);
      }
    }
  };

  const getCurrentPageTitle = () => {
    const currentNav = navItems.find((item) => item.id === activeNav);
    return currentNav ? currentNav.label : 'Dashboard';
  };

  // Helper to get tenant name from ID
  const getTenantName = (tenantId) => {
    const tenant = tenants.find(t => t.id === tenantId);
    return tenant ? tenant.name : 'N/A';
  };

  // Helper to get group name from ID
  const getGroupName = (groupId) => {
    const group = groups.find(g => g.id === groupId);
    return group ? group.name : 'N/A';
  };

  const renderContent = () => {
    switch (activeNav) {
      case 'tenants':
        return (
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
                          <button className="actions-btn" onClick={() => handleTenantAction(tenant)}>
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
        );

      case 'users':
        return (
          <div className="content-card">
            <div className="card-header">
              <h2 className="card-title">All Users</h2>
              <p className="card-subtitle">Manage user accounts in the system.</p>
            </div>

            <div className="table-container">
              {users.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>User ID</th>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Email</th>
                      <th>Mobile</th>
                      <th>Group</th>
                      <th>Role</th>
                      <th>Created At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.userId}>
                        <td>{user.userId}</td>
                        <td>{user.firstName}</td>
                        <td>{user.lastName}</td>
                        <td>{user.email}</td>
                        <td>{user.mobile}</td>
                        <td>{user.group}</td>
                        <td>{user.role}</td>
                        <td>{user.createdAt}</td>
                        <td className="actions-cell">
                          <ActionDropdown
                            itemId={user.userId}
                            onEdit={() => handleEditUser(user)}
                            onDelete={() => handleDeleteUser(user)}
                            isOpen={activeDropdown === user.userId}
                            onToggle={setActiveDropdown}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty-state">
                  <p>No users found. Click "Add User" to get started.</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'group':
        return (
          <div className="content-card">
            <div className="card-header">
              <h2 className="card-title">All Groups</h2>
              <p className="card-subtitle">Manage user groups in the system.</p>
            </div>

            <div className="table-container">
              {groups.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Tenant</th> {/* New column for Tenant */}
                      <th>Description</th>
                      <th>Created At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groups.map((group) => (
                      <tr key={group.id}>
                        <td>{group.id}</td>
                        <td>{group.name}</td>
                        <td>{getTenantName(group.tenantId)}</td> {/* Display tenant name */}
                        <td>{group.description}</td>
                        <td>{group.createdAt}</td>
                        <td>
                          <button className="actions-btn" onClick={() => handleGenericAction(group, 'group')}>
                            ⋯
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty-state">
                  <p>No groups found. Click "Add Group" to get started.</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'roles':
        return (
          <div className="content-card">
            <div className="card-header">
              <h2 className="card-title">All Roles</h2>
              <p className="card-subtitle">Manage user roles and permissions.</p>
            </div>

            <div className="table-container">
              {roles.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Group</th> {/* New column for Group */}
                      <th>Tenant</th> {/* New column for Tenant */}
                      <th>Description</th>
                      <th>Created At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roles.map((role) => (
                      <tr key={role.id}>
                        <td>{role.id}</td>
                        <td>{role.name}</td>
                        <td>{getGroupName(role.groupId)}</td> {/* Display group name */}
                        <td>{getTenantName(role.tenantId)}</td> {/* Display tenant name */}
                        <td>{role.description}</td>
                        <td>{role.createdAt}</td>
                        <td>
                          <button className="actions-btn" onClick={() => handleGenericAction(role, 'role')}>
                            ⋯
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty-state">
                  <p>No roles found. Click "Add Role" to get started.</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'rules':
        return <ChatbotScreen />;

      default:
        return (
          <div className="content-card">
            <div className="card-header">
              <h2 className="card-title">{getCurrentPageTitle()}</h2>
              <p className="card-subtitle">This section is coming soon...</p>
            </div>
            <div style={{ padding: '40px 25px', textAlign: 'center', color: '#7f8c8d' }}>
              <p>🚧 Under Construction</p>
              <p style={{ marginTop: '10px', fontSize: '14px' }}>The {getCurrentPageTitle()} section will be available soon.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="dashboard-container">
      <style>{`
        /* Existing CSS styles */
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

        .add-tenant-btn { /* Renamed from add-tenant-btn to a more generic add-item-btn if used for all */
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
          background-color: #f1f3f4;
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

        .dialog-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.2s ease-out;
        }

        .dialog-content {
          background: white;
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
          width: 100%;
          max-width: 480px; /* Default max-width for single-input dialogs */
          margin: 20px;
          animation: slideIn 0.3s ease-out;
        }

        .dialog-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 25px;
          border-bottom: 1px solid #e1e8ed;
        }

        .dialog-title {
          font-size: 20px;
          font-weight: 600;
          color: #2c3e50;
          margin: 0;
        }

        .dialog-close {
          background: none;
          border: none;
          font-size: 18px;
          color: #7f8c8d;
          cursor: pointer;
          padding: 5px;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .dialog-close:hover {
          background-color: #f1f3f4;
          color: #2c3e50;
        }

        .dialog-body {
          padding: 25px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          font-weight: 500;
          color: #2c3e50;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .form-input {
          width: 100%;
          padding: 12px 15px;
          border: 1px solid #e1e8ed;
          border-radius: 6px;
          font-size: 16px;
          transition: border-color 0.2s ease;
          background-color: #fff;
        }

        .form-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-input.error {
            border-color: #e74c3c;
        }

        .error-message {
          color: #e74c3c;
          font-size: 14px;
          margin-top: 6px;
          margin-bottom: 0;
        }

        .dialog-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }

        .btn-primary {
          background: #667eea;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
          font-size: 14px;
        }

        .btn-primary:hover {
          background: #5a6fd8;
        }

        .btn-secondary {
          background: #f8f9fa;
          color: #5a6c7d;
          border: 1px solid #e1e8ed;
          padding: 10px 20px;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
        }

        .btn-secondary:hover {
          background: #e9ecef;
          border-color: #d1d9e6;
        }

        /* Styles for multi-field forms like UserRegistrationDialog and GroupDialog */
        .form-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideIn {
          from { 
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (min-width: 600px) {
            .form-grid {
                grid-template-columns: 1fr 1fr; /* Two columns on larger screens for user registration */
            }
        }

        /* Adjusted for smaller dialogs if needed, though 1fr is generally good for small forms */
        .dialog-content[style*="max-width: 500px"] .form-grid {
             grid-template-columns: 1fr; /* One column for smaller dialogs like GroupDialog if it has only 2 fields*/
        }
        @media (min-width: 480px) {
          .dialog-content[style*="max-width: 500px"] .form-grid {
              grid-template-columns: 1fr 1fr; /* Two columns for smaller dialogs if they fit */
          }
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

          .dialog-content {
            margin: 10px;
          }

          .dialog-header, .dialog-body {
            padding: 20px;
          }
        }
          /* Actions cell styling */
.actions-cell {
  position: relative;
  text-align: center;
  padding: 8px 12px;
  vertical-align: middle;
  width: 80px;
  min-width: 80px;
}

/* Actions dropdown container */
.actions-dropdown {
  position: relative;
  display: inline-block;
}

/* Actions button (trigger) */
.actions-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px 10px;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #6b7280;
  min-width: 32px;
  min-height: 32px;
}

.actions-btn:hover {
  background-color: #f3f4f6;
  color: #374151;
}

.actions-btn:focus {
  outline: none;
  background-color: #e5e7eb;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

.actions-btn:active {
  background-color: #d1d5db;
  transform: scale(0.95);
}

/* Dropdown menu */
.dropdown-menu {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  z-index: 1000;
  min-width: 140px;
  overflow: hidden;
  animation: dropdownFadeIn 0.15s ease-out;
}

@keyframes dropdownFadeIn {
  from {
    opacity: 0;
    transform: translateY(-8px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Dropdown items */
.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 12px;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
  transition: background-color 0.15s ease;
  text-decoration: none;
  border-bottom: 1px solid transparent;
}

.dropdown-item:hover {
  background-color: #f9fafb;
}

.dropdown-item:focus {
  outline: none;
  background-color: #f3f4f6;
}

.dropdown-item:active {
  background-color: #e5e7eb;
}

/* Edit item styling */
.edit-item {
  color: #3b82f6;
}

.edit-item:hover {
  background-color: #eff6ff;
  color: #2563eb;
}

/* Delete item styling */
.delete-item {
  color: #ef4444;
}

.delete-item:hover {
  background-color: #fef2f2;
  color: #dc2626;
}

/* Add separator between items */
.dropdown-item:not(:last-child) {
  border-bottom: 1px solid #f3f4f6;
}

/* Separator */
.action-dropdown-separator {
  height: 1px;
  background-color: #e5e7eb;
  margin: 4px 0;
}

/* Table row hover effect */
tr:hover .actions-cell .action-dropdown-trigger {
  background-color: #f9fafb;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .actions-cell {
    width: 60px;
    min-width: 60px;
    padding: 4px 8px;
  }
  
  .action-dropdown-menu {
    right: -10px;
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
          {/* Render "Add" button based on active navigation */}
          {currentView === 'dashboard' &&
            (activeNav === 'tenants' || activeNav === 'group' || activeNav === 'roles' || activeNav === 'users') && (
              <button className="add-tenant-btn" onClick={handleAddItem}>
                <span>➕</span>
                {activeNav === 'users' ? 'Add User' : `Add ${navItems.find((item) => item.id === activeNav)?.label.slice(0, -1)}`}
              </button>
            )}
        </div>

        <div className="content-area">{renderContent()}</div>
      </div>

      {/* Generic Input Dialogs for single-field entities */}
      <InputDialog
        isOpen={isTenantDialogOpen}
        onClose={() => setIsTenantDialogOpen(false)}
        onSave={handleSaveTenant}
        title="Create New Tenant"
        label="Tenant Name"
        placeholder="Enter tenant name"
      />

      {/* Dedicated User Registration Dialog */}
      <UserRegistrationDialog
        isOpen={isUserRegistrationDialogOpen}
        onClose={() => setIsUserRegistrationDialogOpen(false)}
        onRegisterUser={handleRegisterUser}
      />

      {/* Dedicated Group Dialog with Tenant Dropdown */}
      <GroupDialog
        isOpen={isGroupDialogOpen}
        onClose={() => setIsGroupDialogOpen(false)}
        onSaveGroup={handleSaveGroup}
        tenants={tenants} // Pass the list of tenants to the dialog
      />

      {/* Dedicated Role Dialog with Group and Tenant Dropdowns */}
      <RoleDialog
        isOpen={isRoleDialogOpen}
        onClose={() => setIsRoleDialogOpen(false)}
        onSaveRole={handleSaveRole}
        groups={groups} // Pass the list of groups
        tenants={tenants} // Pass the list of tenants
      />
    </div>
  );
};

export default Dashboard;
