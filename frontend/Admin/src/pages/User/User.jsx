import React, { useState, useMemo } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  TextField,
  Select,
  MenuItem,
  useMediaQuery,
  useTheme
} from '@mui/material';

const UserList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([
    { 
      id: 1, 
      username: 'admin_john', 
      email: 'john.admin@example.com', 
      role: 'Admin', 
      status: 'Active', 
      lastLogin: '2024-06-15 10:30:45',
      isEditing: false
    },
    { 
      id: 2, 
      username: 'manager_sarah', 
      email: 'sarah.manager@example.com', 
      role: 'Manager', 
      status: 'Active', 
      lastLogin: '2024-06-14 15:22:11',
      isEditing: false
    },
    { 
      id: 3, 
      username: 'staff_mike', 
      email: 'mike.staff@example.com', 
      role: 'Staff', 
      status: 'Inactive', 
      lastLogin: '2024-05-22 09:14:33',
      isEditing: false
    },
    { 
      id: 4, 
      username: 'support_lisa', 
      email: 'lisa.support@example.com', 
      role: 'Support', 
      status: 'Active', 
      lastLogin: '2024-06-16 11:45:22',
      isEditing: false
    },
    { 
      id: 5, 
      username: 'analyst_alex', 
      email: 'alex.analyst@example.com', 
      role: 'Analyst', 
      status: 'Suspended', 
      lastLogin: '2024-05-30 14:20:00',
      isEditing: false
    },
  ]);

  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastLogin.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const handleEditUser = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, isEditing: true, originalUser: { ...user } }
        : user
    ));
  };

  const handleSaveUser = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, isEditing: false, originalUser: undefined }
        : user
    ));
  };

  const handleCancelEdit = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user.originalUser, isEditing: false, originalUser: undefined }
        : user
    ));
  };

  const handleFieldChange = (userId, field, value) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, [field]: value }
        : user
    ));
  };

  // Mobile view render
  const renderMobileView = () => (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <TextField
        fullWidth
        variant="outlined"
        label="Search Users"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ margin: 2, marginBottom: 3 }}
      />
      {filteredUsers.map((user) => (
        <Paper 
          key={user.id} 
          elevation={3} 
          sx={{ 
            margin: 2, 
            padding: 2, 
            display: 'flex', 
            flexDirection: 'column',
            gap: 1
          }}
        >
          {user.isEditing ? (
            <>
              <TextField
                fullWidth
                label="Username"
                value={user.username}
                onChange={(e) => handleFieldChange(user.id, 'username', e.target.value)}
                margin="dense"
              />
              <TextField
                fullWidth
                label="Email"
                value={user.email}
                onChange={(e) => handleFieldChange(user.id, 'email', e.target.value)}
                margin="dense"
              />
              <Select
                fullWidth
                label="Role"
                value={user.role}
                onChange={(e) => handleFieldChange(user.id, 'role', e.target.value)}
                margin="dense"
              >
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Manager">Manager</MenuItem>
                <MenuItem value="Staff">Staff</MenuItem>
                <MenuItem value="Support">Support</MenuItem>
                <MenuItem value="Analyst">Analyst</MenuItem>
              </Select>
              <Select
                fullWidth
                value={user.status}
                onChange={(e) => handleFieldChange(user.id, 'status', e.target.value)}
                margin="dense"
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
                <MenuItem value="Suspended">Suspended</MenuItem>
              </Select>
              <Box sx={{ display: 'flex', gap: 1, marginTop: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => handleSaveUser(user.id)}
                >
                  DONE
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  onClick={() => handleCancelEdit(user.id)}
                >
                  CANCEL
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {user.username}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.role}
                </Typography>
              </Box>
              <Typography variant="body2">
                {user.email}
              </Typography>
              <Typography variant="body2">
                Last Login: {user.lastLogin}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 
                    user.status === 'Active' ? 'green' : 
                    user.status === 'Inactive' ? 'orange' : 
                    'red'
                }}
              >
                Status: {user.status}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, marginTop: 1 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  fullWidth
                  onClick={() => handleEditUser(user.id)}
                >
                  EDIT
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  fullWidth
                  onClick={() => handleDeleteUser(user.id)}
                >
                  DELETE
                </Button>
              </Box>
            </>
          )}
        </Paper>
      ))}
    </Box>
  );

  // Desktop/Tablet view render
  const renderTableView = () => (
    <Box sx={{ 
      width: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center' 
    }}>
      <TextField
        variant="outlined"
        label="Search Users"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ 
          width: '90%', 
          maxWidth: '1200px', 
          margin: 3, 
          marginBottom: 2 
        }}
      />
      <TableContainer 
        component={Paper} 
        sx={{ 
          width: '90%', 
          maxWidth: '1200px', 
          margin: isMobile ? 1 : 3 
        }}
      >
        <Table size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              {!isMobile && <TableCell>Email</TableCell>}
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              {!isMobile && <TableCell>Last Login</TableCell>}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                {user.isEditing ? (
                  <>
                    <TableCell>
                      <TextField
                        value={user.username}
                        onChange={(e) => handleFieldChange(user.id, 'username', e.target.value)}
                        fullWidth
                      />
                    </TableCell>
                    {!isMobile && (
                      <TableCell>
                        <TextField
                          value={user.email}
                          onChange={(e) => handleFieldChange(user.id, 'email', e.target.value)}
                          fullWidth
                        />
                      </TableCell>
                    )}
                    <TableCell>
                      <Select
                        value={user.role}
                        onChange={(e) => handleFieldChange(user.id, 'role', e.target.value)}
                        fullWidth
                      >
                        <MenuItem value="Admin">Admin</MenuItem>
                        <MenuItem value="Manager">Manager</MenuItem>
                        <MenuItem value="Staff">Staff</MenuItem>
                        <MenuItem value="Support">Support</MenuItem>
                        <MenuItem value="Analyst">Analyst</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={user.status}
                        onChange={(e) => handleFieldChange(user.id, 'status', e.target.value)}
                        fullWidth
                      >
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                        <MenuItem value="Suspended">Suspended</MenuItem>
                      </Select>
                    </TableCell>
                    {!isMobile && (
                      <TableCell>
                        <TextField
                          value={user.lastLogin}
                          onChange={(e) => handleFieldChange(user.id, 'lastLogin', e.target.value)}
                          fullWidth
                        />
                      </TableCell>
                    )}
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleSaveUser(user.id)}
                        >
                          DONE
                        </Button>
                        <Button
                          variant="outlined"
                          color="secondary"
                          size="small"
                          onClick={() => handleCancelEdit(user.id)}
                        >
                          CANCEL
                        </Button>
                      </Box>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{user.username}</TableCell>
                    {!isMobile && <TableCell>{user.email}</TableCell>}
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 
                            user.status === 'Active' ? 'green' : 
                            user.status === 'Inactive' ? 'orange' : 
                            'red'
                        }}
                      >
                        {user.status}
                      </Typography>
                    </TableCell>
                    {!isMobile && (
                      <TableCell>
                        <Typography variant="body2" noWrap>
                          {user.lastLogin}
                        </Typography>
                      </TableCell>
                    )}
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 1 }}>
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          onClick={() => handleEditUser(user.id)}
                          sx={{ minWidth: isMobile ? '100%' : 'auto' }}
                        >
                          EDIT
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleDeleteUser(user.id)}
                          sx={{ minWidth: isMobile ? '100%' : 'auto' }}
                        >
                          DELETE
                        </Button>
                      </Box>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      {isMobile ? renderMobileView() : renderTableView()}
    </Box>
  );
};

export default UserList;