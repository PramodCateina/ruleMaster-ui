import React, { useState, useEffect } from 'react';
import ChatbotDashboard from './chatbot.tsx'
import { useNavigate } from 'react-router-dom';
// Mock data and interfaces
const mockKeycloak = {
  token: 'mock-token',
  tokenParsed: {
    given_name: 'John'
  }
};
interface Tenant {
  id: number;
  name: string;
  created_at: string;
}
interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  group_id: string;
  role: string;
  created_at: string;
}
interface Group {
  id: number;
  group_name: string;
  description: string;
  tenantId: number; // Added tenantId to Group interface
  created_at: string;
}
interface Role {
  id: number;
  role_name: string;
  description: string;
  groupId: number; // Added groupId to Role interface
  tenantId: number; // Added tenantId to Role interface
  created_at: string;
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
  const [group, setGroups] = useState(''); // Default group or fetch from options
  const [role, setRole] = useState('');   // Default role or fetch from options
  const [errors, setErrors] = useState({});
  // Mock options for Group and Role (in a real app, these would come from API)
  const groupOptions = ['Admin', 'Users', 'Support', 'Developers'];
  const roleOptions = ['Administrator', 'Manager', 'User', 'Viewer'];
   const [selectedTenantId, setSelectedTenantId] = useState('');
    const [tenants, setTenants] = useState<Tenant[]>([]);
   const [loading, setLoading] = useState(false);
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
      setTenants(data.data);
    } catch (error) {
      console.error('Error fetching tenants:', error);
      setErrors(prev => ({ ...prev, tenants: 'Failed to load tenants' }));
    } finally {
      setLoading(false);
    }
  };
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

            console.log("dadadadada",data.data);

      setGroups(data.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
      setErrors(prev => ({ ...prev, groups: 'Failed to load groups' }));
    } finally {
      setLoading(prev => ({ ...prev, groups: false }));
    }
  };
  // Reset form fields and errors when dialog opens
  useEffect(() => {
    if (isOpen) {
      setFirstName('');
      setLastName('');
      setEmail('');
      setMobile('');
      setGroups('');
      setRole('');
      setErrors({});
      fetchTenants()
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
              <label htmlFor="groupTenant" className="form-label">Organisation</label>
              <select
                id="groupTenant"
                className={`form-input ${errors.selectedTenantId ? 'error' : ''}`}
                value={selectedTenantId}
                onChange={(e) => setSelectedTenantId(e.target.value)}
                disabled={loading}
              >
                <option value="">
                  {loading ? 'Loading tenants...' : 'Select a organisation'}
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
              <div className="form-group">
                <label htmlFor="regGroup" className="form-label">Group</label>
                <select
                  id="regGroup"
                  className={`form-input ${errors.group ? 'error' : ''}`}
                  value={group}
                  onChange={(e) => setGroups(e.target.value)}
                >
                  <option value="">Select a group</option>
                  {groupOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                {errors.group && <p className="error-message">{errors.group}</p>}
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
  const [tenants, setTenants] = useState<Tenant[]>([]);
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
              <label htmlFor="groupTenant" className="form-label">Organisation</label>
              <select
                id="groupTenant"
                className={`form-input ${errors.selectedTenantId ? 'error' : ''}`}
                value={selectedTenantId}
                onChange={(e) => setSelectedTenantId(e.target.value)}
                disabled={loading}
              >
                <option value="">
                  {loading ? 'Loading tenants...' : 'Select a organisation'}
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
  const [groups, setGroups] = useState<Group[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
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

            console.log("dadadadada",data.data);

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
  console.log("selectedTenantIdselectedTenantId",selectedTenantId);
  
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
              <label htmlFor="roleTenant" className="form-label">Organisation</label>
              <select
                id="roleTenant"
                className={`form-input ${errors.selectedTenantId ? 'error' : ''}`}
                value={selectedTenantId}
                onChange={(e) => setSelectedTenantId(e.target.value)}
                disabled={loading.tenants}
              >
                <option value="">
                  {loading.tenants ? 'Loading tenants...' : 'Select a organisation'}
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
            
            <div className="form-group">
              <label htmlFor="roleGroup" className="form-label">Group</label>
             <select
                id="roleGroup"
                className={`form-input ${errors.selectedGroupId ? 'error' : ''}`}
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
                disabled={loading.groups || !selectedTenantId}
              >
                <option value="">
                  {loading.groups ? 'Loading groups...' : !selectedTenantId ? 'Select an organisation first' : 'Select a group'}
                </option>
                {groups
                  .filter(group => group?.tenant_id === selectedTenantId)
                  .map(group => (
                    <option key={group.id} value={group.id}>
                      {group.group_name}
                    </option>
                  ))}
              </select>

              {errors.selectedGroupId && <p className="error-message">{errors.selectedGroupId}</p>}
              {errors.groups && <p className="error-message">{errors.groups}</p>}
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
        onToggle(null); // Close the dropdown when clicking outside
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
          onToggle(isOpen ? null : itemId);
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
 const UserEditDialog = ({ isOpen, onClose, onUpdateUser, userToEdit }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [group, setGroup] = useState('');
  const[groupOptions,setGroups] = useState<Group[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);

  const [role, setRole] = useState('');
  const [errors, setErrors] = useState({});
  // Mock options for Group and Role (in a real app, these would come from API)
  const roleOptions = ['Administrator', 'Manager', 'User', 'Viewer'];
  // Populate form fields when dialog opens with user data
  useEffect(() => {
    if (isOpen && userToEdit) {
      setFirstName(userToEdit.first_name || '');
      setLastName(userToEdit.last_name || '');
      setEmail(userToEdit.email || '');
      setGroup(userToEdit.group_id || '');
      setRole(userToEdit.role || '');
      setErrors({});
      fetchData()
    }
  }, [isOpen, userToEdit]);
    const admin_id = localStorage.getItem("userId"); // Fallback for mock environment

   const fetchGroups = async () => {
    try {
      const response = await fetch(`http://localhost:4002/api/groups/getGroups/${admin_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
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
    }
  };
   const fetchTenants = async () => {
    try {
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
    }
  };
  const fetchData = async () => {
    await Promise.all([fetchGroups(), fetchTenants()]);
  };
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
      const updatedUser = {
        ...userToEdit, // Keep existing properties like userId, createdAt
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
        group: group,
        role: role,
        updatedAt: new Date().toLocaleDateString('en-GB'), // Add update timestamp
      };
      onUpdateUser(updatedUser);
      onClose(); // Close dialog on successful update
    }
  };
  if (!isOpen || !userToEdit) return null;
  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div className="dialog-header">
          <h2 className="dialog-title">Edit User</h2>
          <button className="dialog-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="dialog-body">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="editFirstName" className="form-label">First Name</label>
                <input
                  type="text"
                  id="editFirstName"
                  className={`form-input ${errors.firstName ? 'error' : ''}`}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter first name"
                  autoFocus
                />
                {errors.firstName && <p className="error-message">{errors.firstName}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="editLastName" className="form-label">Last Name</label>
                <input
                  type="text"
                  id="editLastName"
                  className={`form-input ${errors.lastName ? 'error' : ''}`}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter last name"
                />
                {errors.lastName && <p className="error-message">{errors.lastName}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="editEmail" className="form-label">Email</label>
                <input
                  type="email"
                  id="editEmail"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                />
                {errors.email && <p className="error-message">{errors.email}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="editMobile" className="form-label">Mobile</label>
                <input
                  type="tel"
                  id="editMobile"
                  className={`form-input ${errors.mobile ? 'error' : ''}`}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Enter mobile number"
                />
                {errors.mobile && <p className="error-message">{errors.mobile}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="editGroup" className="form-label">Group</label>
                <select
                  id="editGroup"
                  className={`form-input ${errors.group ? 'error' : ''}`}
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                >
                  <option value="">Select a group</option>
                   {groupOptions.map(groupItem => (
                    <option key={groupItem.id || groupItem.group_id} value={groupItem.id || groupItem.group_id}>
                      {groupItem.name || groupItem.group_name}
                    </option>
                  ))}                </select>
                {errors.group && <p className="error-message">{errors.group}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="editRole" className="form-label">Role</label>
                <select
                  id="editRole"
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
              Update User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
const Dashboard = ({ keycloak = mockKeycloak }) => {
   const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('tenants');
  const [currentView, setCurrentView] = useState('dashboard');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  // Dialog open states for different entities
  const [isTenantDialogOpen, setIsTenantDialogOpen] = useState(false);
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isUserRegistrationDialogOpen, setIsUserRegistrationDialogOpen] = useState(false);
  const [isUserEditDialogOpen, setIsUserEditDialogOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState({
    tenants: false,
    groups: false,
    roles: false,
    users: false,
  });

  // Data states
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const admin_id = localStorage.getItem("userId"); // Fallback for mock environment

  // --- Fetch Data Functions ---
  const fetchTenants = async () => {
    try {
      setLoading(prev => ({ ...prev, tenants: true }));
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
      setTenants(data.data);
    } catch (error) {
      console.error('Error fetching tenants:', error);
      setErrors(prev => ({ ...prev, tenants: 'Failed to load tenants' }));
    } finally {
      setLoading(prev => ({ ...prev, tenants: false }));
    }
  };

  const fetchGroups = async () => {
    try {
      setLoading(prev => ({ ...prev, groups: true }));
      const response = await fetch(`http://localhost:4002/api/groups/getGroups/${admin_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
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

  const fetchRoles = async () => {
    try {
      setLoading(prev => ({ ...prev, roles: true }));
      const response = await fetch(`http://localhost:4002/api/roles/getRoles/${admin_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setRoles(data.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
      setErrors(prev => ({ ...prev, roles: 'Failed to load roles' }));
    } finally {
      setLoading(prev => ({ ...prev, roles: false }));
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(prev => ({ ...prev, users: true }));
      const response = await fetch(`http://localhost:4002/api/users/getUsers/${admin_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setErrors(prev => ({ ...prev, users: 'Failed to load users' }));
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  };


  // --- useEffect for initial data load based on activeNav ---
  useEffect(() => {
    setErrors({}); // Clear errors on view change
    if (activeNav === 'tenants') {
      fetchTenants();
    } else if (activeNav === 'groups') {
      fetchGroups();
    } else if (activeNav === 'roles') {
      fetchRoles();
    } else if (activeNav === 'users') {
      fetchUsers();
    }
  }, [activeNav]);

  // --- Handlers for Dialogs ---
  const handleCreateTenant = async (name: string) => {
    try {
       const profileString = localStorage.getItem("userProfile");
      const userProfile = profileString ? JSON.parse(profileString) : undefined;
      const newTenant = {
    name,
    createdAt: new Date().toLocaleDateString('en-GB'),
    userDetails : userProfile
  };
      const response = await fetch('http://localhost:4002/api/realm/createRealm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          createdAt: newTenant.createdAt,
          userDetails: newTenant.userDetails
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await response.json();
      fetchTenants(); // Refresh list after creation
    } catch (error) {
      console.error('Error creating tenant:', error);
      setErrors(prev => ({ ...prev, createTenant: 'Failed to create tenant' }));
    }
  };

  const handleDeleteTenant = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this tenant?')) return;
    try {
      const response = await fetch(`http://localhost:4002/api/realm/deleteRealm/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchTenants(); // Refresh list after deletion
    } catch (error) {
      console.error('Error deleting tenant:', error);
      setErrors(prev => ({ ...prev, deleteTenant: 'Failed to delete tenant' }));
    }
  };

  const handleCreateGroup = async (group_name: string, tenantId: number) => {
    try {
      const response = await fetch('http://localhost:4002/api/groups/createGroup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ group_name, tenantId, admin_id }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await response.json();
      fetchGroups(); // Refresh list after creation
    } catch (error) {
      console.error('Error creating group:', error);
      setErrors(prev => ({ ...prev, createGroup: 'Failed to create group' }));
    }
  };

  const handleDeleteGroup = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this group?')) return;
    try {
      const response = await fetch(`http://localhost:4002/api/groups/deleteGroup/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchGroups(); // Refresh list after deletion
    } catch (error) {
      console.error('Error deleting group:', error);
      setErrors(prev => ({ ...prev, deleteGroup: 'Failed to delete group' }));
    }
  };

  const handleCreateRole = async (role_name: string, groupId: number, tenantId: number) => {
    try {
      const response = await fetch('http://localhost:4002/api/roles/createRole', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role_name, groupId, tenantId, admin_id }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await response.json();
      fetchRoles(); // Refresh list after creation
    } catch (error) {
      console.error('Error creating role:', error);
      setErrors(prev => ({ ...prev, createRole: 'Failed to create role' }));
    }
  };

  const handleDeleteRole = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this role?')) return;
    try {
      const response = await fetch(`http://localhost:4002/api/roles/deleteRole/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchRoles(); // Refresh list after deletion
    } catch (error) {
      console.error('Error deleting role:', error);
      setErrors(prev => ({ ...prev, deleteRole: 'Failed to delete role' }));
    }
  };

  const handleRegisterUser = async (newUser: User) => {
    try {
      const response = await fetch('http://localhost:4002/api/users/createUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...newUser, admin_id }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await response.json();
      fetchUsers(); // Refresh list after creation
    } catch (error) {
      console.error('Error registering user:', error);
      setErrors(prev => ({ ...prev, registerUser: 'Failed to register user' }));
    }
  };

  const handleUpdateUser = async (updatedUser: User) => {
    try {
      const response = await fetch(`http://localhost:4002/api/users/updateUser/${updatedUser.userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await response.json();
      fetchUsers(); // Refresh list after update
    } catch (error) {
      console.error('Error updating user:', error);
      setErrors(prev => ({ ...prev, updateUser: 'Failed to update user' }));
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const response = await fetch(`http://localhost:4002/api/users/deleteUser/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchUsers(); // Refresh list after deletion
    } catch (error) {
      console.error('Error deleting user:', error);
      setErrors(prev => ({ ...prev, deleteUser: 'Failed to delete user' }));
    }
  };


  const handleEditUser = (user: User) => {
    setUserToEdit(user);
    setIsUserEditDialogOpen(true);
  };

  const navItems: NavItem[] = [
    { id: 'tenants', label: 'Organisation', icon: '🏢' },
    { id: 'groups', label: 'Groups', icon: '👥' },
    { id: 'roles', label: 'Roles', icon: '🔑' },
    { id: 'users', label: 'Users', icon: '👤' },
    { id: 'rules', label: 'Rules', icon: '🤖' },
  ];
const [rules, setRules] = useState([
  {
    id: 1,
    name: "Password Policy",
    description: "Enforce strong password requirements for all users",
    isActive: true,
    created_at: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    name: "Session Timeout",
    description: "Automatically log out users after 30 minutes of inactivity",
    isActive: false,
    created_at: "2024-01-20T14:45:00Z"
  },
  {
    id: 3,
    name: "File Upload Restrictions",
    description: "Limit file uploads to specific formats and sizes",
    isActive: true,
    created_at: "2024-02-01T09:15:00Z"
  },
  {
    id: 4,
    name: "API Rate Limiting",
    description: "Prevent abuse by limiting API requests per user",
    isActive: true,
    created_at: "2024-02-05T16:20:00Z"
  }
]);

  const handleToggleRule = (ruleId) => {
    setRules(prevRules => 
      prevRules.map(rule => 
        rule.id === ruleId 
          ? { ...rule, isActive: !rule.isActive }
          : rule
      )
    );
  };

  // const ActionDropdown = ({ itemId, isOpen, onToggle, onEdit, onDelete }) => {
  //   return (
  //     <div className="action-dropdown">
  //       <button 
  //         className="action-btn"
  //         onClick={() => onToggle(isOpen ? null : itemId)}
  //       >
  //         ⋮
  //       </button>
  //       {isOpen && (
  //         <div className="dropdown-menu">
  //           <button onClick={onEdit} className="dropdown-item">Edit</button>
  //           <button onClick={onDelete} className="dropdown-item delete">Delete</button>
  //         </div>
  //       )}
  //     </div>
  //   );
  // };

  const handleEditRule = (rule) => {
    alert(`Edit Rule: ${rule.name}`);
  };

  const handleDeleteRule = (ruleId) => {
    if (window.confirm('Are you sure you want to delete this rule?')) {
      setRules(prevRules => prevRules.filter(rule => rule.id !== ruleId));
    }
  };

  const renderContent = () => {
    switch (activeNav) {
      case 'tenants':
        return (
          <div className="content-card">
            <div className="card-header">
              <h2 className="card-title">Organisation Management</h2>
              <button className="btn-primary" onClick={() => setIsTenantDialogOpen(true)}>
                Add New Organisation
              </button>
            </div>
            {errors.tenants && <p className="error-message">{errors.tenants}</p>}
            {errors.createTenant && <p className="error-message">{errors.createTenant}</p>}
            {errors.deleteTenant && <p className="error-message">{errors.deleteTenant}</p>}
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Organisation ID</th>
                    <th>Name</th>
                    <th>Created At</th>
                    {/* <th className="text-center">Actions</th> */}
                  </tr>
                </thead>
                <tbody>
                  {loading.tenants ? (
                    <tr>
                      <td colSpan={4} className="text-center">Loading tenants...</td>
                    </tr>
                  ) : tenants.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center">No tenants found.</td>
                    </tr>
                  ) : (
                    tenants.map((tenant) => (
                      <tr key={tenant.id}>
                        <td>{tenant.id}</td>
                        <td>{tenant.name}</td>
                        <td>{new Date(tenant.created_at).toLocaleDateString('en-GB')}</td>
                        {/* <td className="text-center">
                          <ActionDropdown
                            itemId={tenant.id.toString()}
                            isOpen={activeDropdown === tenant.id.toString()}
                            onToggle={setActiveDropdown}
                            onEdit={() => alert(`Edit Tenant ${tenant.name}`)}
                            onDelete={() => handleDeleteTenant(tenant.id)}
                          />
                        </td> */}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'groups':
        return (
          <div className="content-card">
            <div className="card-header">
              <h2 className="card-title">Groups Management</h2>
              <button className="btn-primary" onClick={() => setIsGroupDialogOpen(true)}>
                Create New Group
              </button>
            </div>
            {errors.groups && <p className="error-message">{errors.groups}</p>}
            {errors.createGroup && <p className="error-message">{errors.createGroup}</p>}
            {errors.deleteGroup && <p className="error-message">{errors.deleteGroup}</p>}
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Group ID</th>
                    <th>Group Name</th>
                    <th>Organisation Name</th>
                    <th>Created At</th>
                    {/* <th className="text-center">Actions</th> */}
                  </tr>
                </thead>
                <tbody>
                  {loading.groups ? (
                    <tr>
                      <td colSpan={6} className="text-center">Loading groups...</td>
                    </tr>
                  ) : groups.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center">No groups found.</td>
                    </tr>
                  ) : (
                    groups.map((group) => (
                      <tr key={group.id}>
                        <td>{group.id}</td>
                        <td>{group.group_name}</td>
                        <td>{group.tenant_name}</td>
                        <td>{new Date(group.created_at).toLocaleDateString('en-GB')}</td>
                        {/* <td className="text-center">
                          <ActionDropdown
                            itemId={group.id.toString()}
                            isOpen={activeDropdown === group.id.toString()}
                            onToggle={setActiveDropdown}
                            onEdit={() => alert(`Edit Group ${group.group_name}`)}
                            onDelete={() => handleDeleteGroup(group.id)}
                          />
                        </td> */}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'roles':
        return (
          <div className="content-card">
            <div className="card-header">
              <h2 className="card-title">Roles Management</h2>
              <button className="btn-primary" onClick={() => setIsRoleDialogOpen(true)}>
                Create New Role
              </button>
            </div>
            {errors.roles && <p className="error-message">{errors.roles}</p>}
            {errors.createRole && <p className="error-message">{errors.createRole}</p>}
            {errors.deleteRole && <p className="error-message">{errors.deleteRole}</p>}
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Role ID</th>
                    <th>Role Name</th>
                    <th>Group Name</th>
                    <th>Organisation ID</th>
                    <th>Created At</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading.roles ? (
                    <tr>
                      <td colSpan={6} className="text-center">Loading roles...</td>
                    </tr>
                  ) : roles.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center">No roles found.</td>
                    </tr>
                  ) : (
                    roles.map((role) => (
                      <tr key={role.id}>
                        <td>{role.id}</td>
                        <td>{role.role_name}</td>
                        <td>{role.group_name}</td>
                        <td>{role.tenant_id}</td>
                        <td>{new Date(role.created_at).toLocaleDateString('en-GB')}</td>
                        <td className="text-center">
                          <ActionDropdown
                            itemId={role.id.toString()}
                            isOpen={activeDropdown === role.id.toString()}
                            onToggle={setActiveDropdown}
                            onEdit={() => alert(`Edit Role ${role.role_name}`)}
                            onDelete={() => handleDeleteRole(role.id)}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'users':
        return (
          <div className="content-card">
            <div className="card-header">
              <h2 className="card-title">User Management</h2>
              <button className="btn-primary" onClick={() => setIsUserRegistrationDialogOpen(true)}>
                Register New User
              </button>
            </div>
            {errors.users && <p className="error-message">{errors.users}</p>}
            {errors.registerUser && <p className="error-message">{errors.registerUser}</p>}
            {errors.updateUser && <p className="error-message">{errors.updateUser}</p>}
            {errors.deleteUser && <p className="error-message">{errors.deleteUser}</p>}
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Group</th>
                    <th>Role</th>
                    <th>Created At</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading.users ? (
                    <tr>
                      <td colSpan={9} className="text-center">Loading users...</td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center">No users found.</td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.first_name}</td>
                        <td>{user.last_name}</td>
                        <td>{user.email}</td>
                        <td>{user.group_id}</td>
                        <td>{user.role}</td>
                        <td>{user.created_at}</td>
                        <td className="text-center">
                          <ActionDropdown
                            itemId={user.userId}
                            isOpen={activeDropdown === user.userId}
                            onToggle={setActiveDropdown}
                            onEdit={() => handleEditUser(user)}
                            onDelete={() => handleDeleteUser(user.userId)}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
    case 'rules':
  return (
    <div className="content-card">
      <div className="card-header">
        <h2 className="card-title">Rules Management</h2>
    <button className="btn-primary" onClick={() => navigate('/ChatbotScreen')}>
      Create New Rule
    </button>
      </div>
      
      {errors.rules && <p className="error-message">{errors.rules}</p>}
      {errors.createRule && <p className="error-message">{errors.createRule}</p>}
      {errors.deleteRule && <p className="error-message">{errors.deleteRule}</p>}
      
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Rule ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Status</th>
              <th className="text-center">Active</th>
              <th>Created At</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading.rules ? (
              <tr>
                <td colSpan={7} className="text-center">Loading rules...</td>
              </tr>
            ) : rules.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center">No rules found.</td>
              </tr>
            ) : (
              rules.map((rule) => (
                <tr key={rule.id}>
                  <td>{rule.id}</td>
                  <td style={{ fontWeight: '500', color: '#374151' }}>{rule.name}</td>
                  <td>
                    <div 
                      style={{
                        maxWidth: '300px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                      title={rule.description}
                    >
                      {rule.description}
                    </div>
                  </td>
                  <td>
                    <span 
                      style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        background: rule.isActive ? '#d1fae5' : '#fee2e2',
                        color: rule.isActive ? '#065f46' : '#991b1b'
                      }}
                    >
                      {rule.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="text-center">
                    <label style={{
                      position: 'relative',
                      display: 'inline-block',
                      width: '50px',
                      height: '24px'
                    }}>
                      <input
                        type="checkbox"
                        checked={rule.isActive}
                        onChange={() => handleToggleRule(rule.id)}
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span 
                        style={{
                          position: 'absolute',
                          cursor: 'pointer',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: rule.isActive ? '#10b981' : '#ccc',
                          transition: '0.3s',
                          borderRadius: '24px'
                        }}
                      >
                        <span
                          style={{
                            position: 'absolute',
                            content: '""',
                            height: '18px',
                            width: '18px',
                            left: rule.isActive ? '29px' : '3px',
                            bottom: '3px',
                            backgroundColor: 'white',
                            transition: '0.3s',
                            borderRadius: '50%'
                          }}
                        />
                      </span>
                    </label>
                  </td>
                  <td>{new Date(rule.created_at).toLocaleDateString('en-GB')}</td>
                  <td className="text-center">
                    <ActionDropdown
                      itemId={rule.id.toString()}
                      isOpen={activeDropdown === rule.id.toString()}
                      onToggle={setActiveDropdown}
                      onEdit={() => alert(`Edit Rule: ${rule.name}`)}
                      onDelete={() => handleDeleteRule(rule.id)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
      default:
        return (
          <div className="content-card">
            <div className="card-header">
              <h2 className="card-title">Welcome to the Dashboard!</h2>
              <p className="card-subtitle">Select an option from the sidebar to get started.</p>
            </div>
            <div style={{ padding: '25px' }}>
              <p>Hello, {keycloak.tokenParsed?.given_name || 'Guest'}!</p>
              <p>This is your central hub for managing tenants, groups, roles, and users within the system. Use the navigation on the left to explore different functionalities.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="dashboard-container">
      <style>{`
        /* General Styles */
        body {
          margin: 0;
          font-family: 'Inter', sans-serif;
          background-color: #f4f7f6;
          color: #333;
        }
        .dashboard-container {
          display: flex;
          min-height: 100vh;
          background-color: #f0f2f5;
        }
        /* Sidebar Styles */
        .sidebar {
          width: 250px;
          background-color: #fff;
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
          padding: 20px 0;
          display: flex;
          flex-direction: column;
          border-right: 1px solid #e0e0e0;
        }
        .sidebar-header {
          padding: 0 20px 20px;
          border-bottom: 1px solid #eee;
          margin-bottom: 20px;
        }
        .sidebar-header h1 {
          font-size: 24px;
          color: #2c3e50;
          margin: 0;
          display: flex;
          align-items: center;
        }
        .sidebar-header h1 img {
          height: 30px;
          margin-right: 10px;
        }
        .nav-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .nav-item button {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 15px 20px;
          color: #555;
          text-align: left;
          border: none;
          background: none;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s, color 0.3s;
        }
        .nav-item button .icon {
          margin-right: 10px;
          font-size: 20px;
        }
        .nav-item button:hover {
          background-color: #f0f2f5;
          color: #667eea;
        }
        .nav-item button.active {
          background-color: #e9f0ff;
          color: #667eea;
          border-right: 4px solid #667eea;
          font-weight: bold;
        }
        /* Main Content Styles */
        .main-content {
          flex-grow: 1;
          padding: 20px;
          overflow-y: auto;
        }
        .welcome-header {
          background-color: #fff;
          padding: 25px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
          margin-bottom: 20px;
        }
        .welcome-header h2 {
          margin-top: 0;
          color: #2c3e50;
          font-size: 28px;
        }
        .welcome-header p {
          color: #666;
          line-height: 1.6;
        }
        /* Content Card Styles */
        .content-card {
          background-color: #fff;
          padding: 25px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
          margin-bottom: 20px;
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .card-header .card-title {
          font-size: 24px;
          color: #2c3e50;
          margin: 0;
        }
        .card-header .card-subtitle {
          color: #777;
          margin: 5px 0 0;
          font-size: 15px;
        }
        /* Buttons */
        .btn-primary {
          background-color: #667eea;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s ease;
        }
        .btn-primary:hover {
          background-color: #0056b3;
        }
        .btn-secondary {
          background-color: #6c757d;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s ease;
          margin-right: 10px;
        }
        .btn-secondary:hover {
          background-color: #5a6268;
        }
        /* Table Styles */
        .table-responsive {
          overflow-x: auto;
        }
        .data-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
          font-size: 15px;
        }
        .data-table th, .data-table td {
          border: 1px solid #eee;
          padding: 12px 15px;
          text-align: left;
        }
        .data-table th {
          background-color: #f8f9fa;
          font-weight: bold;
          color: #555;
          text-transform: uppercase;
          font-size: 13px;
        }
        .data-table tbody tr:nth-child(even) {
          background-color: #fdfdfd;
        }
        .data-table tbody tr:hover {
          background-color: #f0f8ff;
        }
        .text-center {
          text-align: center;
        }
        /* Dialog Overlay */
        .dialog-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        /* Dialog Content */
        .dialog-content {
          background-color: #fff;
          padding: 0; /* Remove padding here, add to sections */
          border-radius: 8px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
          width: 90%;
          max-width: 450px;
          animation: fadeIn 0.3s ease-out;
          display: flex;
          flex-direction: column;
          max-height: 90vh; /* Ensure dialog doesn't exceed viewport height */
          overflow-y: auto; /* Enable scrolling for content if needed */
        }
        .dialog-header {
          padding: 25px 25px 15px;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .dialog-title {
          margin: 0;
          font-size: 22px;
          color: #2c3e50;
        }
        .dialog-close {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #888;
          transition: color 0.2s;
        }
        .dialog-close:hover {
          color: #333;
        }
        .dialog-body {
          padding: 25px;
          flex-grow: 1; /* Allow body to take available space */
          overflow-y: auto; /* Make body scrollable if content overflows */
        }
        .form-group {
          margin-bottom: 18px;
        }
        .form-label {
          display: block;
          margin-bottom: 8px;
          font-weight: bold;
          color: #444;
          font-size: 14px;
        }
        .form-input {
          width: calc(100% - 20px); /* Adjust for padding */
          padding: 12px 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          font-size: 16px;
          box-sizing: border-box; /* Include padding in width */
          transition: border-color 0.2s;
        }
        .form-input:focus {
          border-color: #667eea;
          outline: none;
        }
        .form-input.error {
          border-color: #dc3545;
        }
        .error-message {
          color: #dc3545;
          font-size: 13px;
          margin-top: 5px;
        }
        .dialog-actions {
          padding: 15px 25px 25px;
          border-top: 1px solid #eee;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
        }
        .dialog-actions button {
          min-width: 90px;
        }
        /* Form Grid for multi-field dialogs */
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        @media (max-width: 600px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }
        /* Action Dropdown */
        .actions-dropdown {
          position: relative;
          display: inline-block;
        }
        .actions-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #888;
          padding: 0 8px;
        }
        .actions-btn:hover {
          color: #333;
        }
        .dropdown-menu {
          position: absolute;
          right: 0;
          background-color: #fff;
          min-width: 120px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          border-radius: 4px;
          z-index: 100;
          overflow: hidden;
        }
        .dropdown-item {
          display: block;
          width: 100%;
          padding: 10px 15px;
          border: none;
          background: none;
          text-align: left;
          cursor: pointer;
          font-size: 14px;
          color: #333;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .dropdown-item:hover {
          background-color: #f5f5f5;
          color: #667eea;
        }
        .dropdown-item.delete-item {
          color: #dc3545;
        }
        .dropdown-item.delete-item:hover {
          background-color: #fdeded;
        }
        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div className="sidebar">
        <div className="sidebar-header">
          <h1>
            <img src="https://www.google.com/s2/favicons?domain=react.dev" alt="Logo" />
            Admin Panel
          </h1>
        </div>
        <ul className="nav-list">
          {navItems.map((item) => (
            <li className="nav-item" key={item.id}>
              <button
                className={activeNav === item.id ? 'active' : ''}
                onClick={() => setActiveNav(item.id)}
              >
                <span className="icon">{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="main-content">
        {/* <div className="welcome-header">
          <h2>Hello, {keycloak.tokenParsed?.given_name || 'Admin'}!</h2>
          <p>Welcome to your administration dashboard. Here you can manage various aspects of your system.</p>
        </div> */}
        {renderContent()}
      </div>

      <InputDialog
        isOpen={isTenantDialogOpen}
        onClose={() => setIsTenantDialogOpen(false)}
        onSave={handleCreateTenant}
        title="Create New Organisation"
        label="Organisation Name"
        placeholder="e.g., My Organization Inc."
      />

      <UserRegistrationDialog
        isOpen={isUserRegistrationDialogOpen}
        onClose={() => setIsUserRegistrationDialogOpen(false)}
        onRegisterUser={handleRegisterUser}
      />

      <UserEditDialog
        isOpen={isUserEditDialogOpen}
        onClose={() => setIsUserEditDialogOpen(false)}
        onUpdateUser={handleUpdateUser}
        userToEdit={userToEdit}
      />

      <GroupDialog
        isOpen={isGroupDialogOpen}
        onClose={() => setIsGroupDialogOpen(false)}
        onSaveGroup={handleCreateGroup}
      />

      <RoleDialog
        isOpen={isRoleDialogOpen}
        onClose={() => setIsRoleDialogOpen(false)}
        onSaveRole={handleCreateRole}
      />
    </div>
  );
};

export default Dashboard;