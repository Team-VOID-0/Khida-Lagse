// import React, { useState, useEffect } from 'react';
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Box, TextField, Select, MenuItem, useMediaQuery, useTheme } from '@mui/material';

// const UserList = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

//   const [searchTerm, setSearchTerm] = useState('');
//   const [users, setUsers] = useState([]);

//   // Fetch users data from API
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await fetch('http://localhost:8000/get_all_users/');
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         const data = await response.json();
//         setUsers(data);
//       } catch (error) {
//         console.error('Failed to fetch users:', error);
//       }
//     };

//     fetchUsers();
//   }, []);

//   const filteredUsers = users.filter(user => 
//     user.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     user.mobile_number.includes(searchTerm)
//   );

//   const handleDeleteUser = async (userName) => {
//     console.log(userName);
//     try {
//       const response = await fetch('http://localhost:8000/delete_user_account/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           // Include any authentication token if required
//         },
//         body: JSON.stringify({ user_name: userName })  // Send the user name as part of the request body
//       });
  
//       if (response.ok) {
//         // Handle successful deletion, e.g., update the state, show a success message, etc.
//         alert("Account deleted successfully!");
//         // You might also want to redirect the user to a different page
//       } else {
//         const errorData = await response.json();
//         alert(errorData.detail);  // Display the error message from the API
//       }
//     } catch (error) {
//       console.error("Error deleting user account:", error);
//       alert("An error occurred while deleting the account.");
//     }
//   };
  

//   const handleEditUser = (userId) => {
//     setUsers(users.map(user => 
//       user.user_id === userId 
//         ? { ...user, isEditing: true, originalUser: { ...user } }
//         : user
//     ));
//   };

//   const handleSaveUser = (userId) => {
//     setUsers(users.map(user => 
//       user.user_id === userId 
//         ? { ...user, isEditing: false, originalUser: undefined }
//         : user
//     ));
//   };

//   const handleCancelEdit = (userId) => {
//     setUsers(users.map(user => 
//       user.user_id === userId 
//         ? { ...user.originalUser, isEditing: false, originalUser: undefined }
//         : user
//     ));
//   };

//   const handleFieldChange = (userId, field, value) => {
//     setUsers(users.map(user => 
//       user.user_id === userId 
//         ? { ...user, [field]: value }
//         : user
//     ));
//   };

//   // Mobile view render
//   const renderMobileView = () => (
//     <Box sx={{ width: '100%', overflowX: 'auto' }}>
//       <TextField
//         fullWidth
//         variant="outlined"
//         label="Search Users"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         sx={{ margin: 2, marginBottom: 3 }}
//       />
//       {filteredUsers.map((user) => (
//         <Paper 
//           key={user.user_id} 
//           elevation={3} 
//           sx={{ 
//             margin: 2, 
//             padding: 2, 
//             display: 'flex', 
//             flexDirection: 'column',
//             gap: 1
//           }}
//         >
//           {user.isEditing ? (
//             <>
//               <TextField
//                 fullWidth
//                 label="Username"
//                 value={user.user_name}
//                 onChange={(e) => handleFieldChange(user.user_id, 'user_name', e.target.value)}
//                 margin="dense"
//               />
//               <TextField
//                 fullWidth
//                 label="Email"
//                 value={user.email}
//                 onChange={(e) => handleFieldChange(user.user_id, 'email', e.target.value)}
//                 margin="dense"
//               />
//               <TextField
//                 fullWidth
//                 label="Mobile Number"
//                 value={user.mobile_number}
//                 onChange={(e) => handleFieldChange(user.user_id, 'mobile_number', e.target.value)}
//                 margin="dense"
//               />
//               <Select
//                 fullWidth
//                 label="Role"
//                 value={user.role}
//                 onChange={(e) => handleFieldChange(user.user_id, 'role', e.target.value)}
//                 margin="dense"
//               >
//                 <MenuItem value="admin">Admin</MenuItem>
//                 <MenuItem value="delivery">Delivery Man</MenuItem>
//                 <MenuItem value="user">User</MenuItem>
//               </Select>
//               <Select
//                 fullWidth
//                 value={user.is_active ? "Active" : "Inactive"}
//                 onChange={(e) => handleFieldChange(user.user_id, 'is_active', e.target.value === "Active")}
//                 margin="dense"
//               >
//                 <MenuItem value="Active">Active</MenuItem>
//                 <MenuItem value="Inactive">Inactive</MenuItem>
//               </Select>
//               <Box sx={{ display: 'flex', gap: 1, marginTop: 1 }}>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   fullWidth
//                   onClick={() => handleSaveUser(user.user_id)}
//                 >
//                   DONE
//                 </Button>
//                 <Button
//                   variant="outlined"
//                   color="secondary"
//                   fullWidth
//                   onClick={() => handleCancelEdit(user.user_id)}
//                 >
//                   CANCEL
//                 </Button>
//               </Box>
//             </>
//           ) : (
//             <>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                 <Typography variant="subtitle1" fontWeight="bold">
//                   {user.user_name}
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   {user.role}
//                 </Typography>
//               </Box>
//               <Typography variant="body2">
//                 {user.email}
//               </Typography>
//               <Typography variant="body2">
//                 Mobile: {user.mobile_number}
//               </Typography>
//               <Typography 
//                 variant="body2" 
//                 sx={{ 
//                   color: 
//                     user.is_active ? 'green' : 'orange'
//                 }}
//               >
//                 Status: {user.is_active ? 'Active' : 'Inactive'}
//               </Typography>
//               <Box sx={{ display: 'flex', gap: 1, marginTop: 1 }}>
//                 <Button
//                   variant="outlined"
//                   color="primary"
//                   size="small"
//                   fullWidth
//                   onClick={() => handleEditUser(user.user_id)}
//                 >
//                   EDIT
//                 </Button>
//                 <Button
//                   variant="outlined"
//                   color="error"
//                   size="small"
//                   fullWidth
//                   onClick={() => handleDeleteUser(user.user_name)}
//                 >
//                   DELETE
//                 </Button>
//               </Box>
//             </>
//           )}
//         </Paper>
//       ))}
//     </Box>
//   );

//   // Desktop/Tablet view render
//   const renderTableView = () => (
//     <Box sx={{ 
//       width: '100%', 
//       display: 'flex', 
//       flexDirection: 'column',
//       alignItems: 'center' 
//     }}>
//       <TextField
//         variant="outlined"
//         label="Search Users"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         sx={{ 
//           width: '90%', 
//           maxWidth: '1200px', 
//           margin: 3, 
//           marginBottom: 2 
//         }}
//       />
//       <TableContainer 
//         component={Paper} 
//         sx={{ 
//           width: '90%', 
//           maxWidth: '1200px', 
//           margin: isMobile ? 1 : 3 
//         }}
//       >
//         <Table size={isMobile ? 'small' : 'medium'}>
//           <TableHead>
//             <TableRow>
//               <TableCell>Username</TableCell>
//               {!isMobile && <TableCell>Email</TableCell>}
//               <TableCell>Mobile Number</TableCell>
//               <TableCell>Role</TableCell>
//               <TableCell>Status</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filteredUsers.map((user) => (
//               <TableRow key={user.user_id}>
//                 {user.isEditing ? (
//                   <>
//                     <TableCell>
//                       <TextField
//                         value={user.user_name}
//                         onChange={(e) => handleFieldChange(user.user_id, 'user_name', e.target.value)}
//                         fullWidth
//                       />
//                     </TableCell>
//                     {!isMobile && (
//                       <TableCell>
//                         <TextField
//                           value={user.email}
//                           onChange={(e) => handleFieldChange(user.user_id, 'email', e.target.value)}
//                           fullWidth
//                         />
//                       </TableCell>
//                     )}
//                     <TableCell>
//                       <TextField
//                         value={user.mobile_number}
//                         onChange={(e) => handleFieldChange(user.user_id, 'mobile_number', e.target.value)}
//                         fullWidth
//                       />
//                     </TableCell>
//                     <TableCell>
//                       <Select
//                         value={user.role}
//                         onChange={(e) => handleFieldChange(user.user_id, 'role', e.target.value)}
//                         fullWidth
//                       >
//                         <MenuItem value="admin">Admin</MenuItem>
//                         <MenuItem value="delivery">Delivery Man</MenuItem>
//                         <MenuItem value="user">User</MenuItem>
//                       </Select>
//                     </TableCell>
//                     <TableCell>
//                       <Select
//                         value={user.is_active ? "Active" : "Inactive"}
//                         onChange={(e) => handleFieldChange(user.user_id, 'is_active', e.target.value === "Active")}
//                         fullWidth
//                       >
//                         <MenuItem value="Active">Active</MenuItem>
//                         <MenuItem value="Inactive">Inactive</MenuItem>
//                       </Select>
//                     </TableCell>
//                     <TableCell>
//                       <Button
//                         variant="contained"
//                         color="primary"
//                         onClick={() => handleSaveUser(user.user_id)}
//                       >
//                         DONE
//                       </Button>
//                       <Button
//                         variant="outlined"
//                         color="secondary"
//                         onClick={() => handleCancelEdit(user.user_id)}
//                       >
//                         CANCEL
//                       </Button>
//                     </TableCell>
//                   </>
//                 ) : (
//                   <>
//                     <TableCell>{user.user_name}</TableCell>
//                     {!isMobile && <TableCell>{user.email}</TableCell>}
//                     <TableCell>{user.mobile_number}</TableCell>
//                     <TableCell>{user.role}</TableCell>
//                     <TableCell
//                       sx={{ 
//                         color: 
//                           user.is_active ? 'green' : 
//                           'orange' 
//                       }}
//                     >
//                       {user.is_active ? 'Active' : 'Inactive'}
//                     </TableCell>
//                     <TableCell>
//                       <Button
//                         variant="outlined"
//                         color="primary"
//                         size="small"
//                         onClick={() => handleEditUser(user.user_id)}
//                       >
//                         EDIT
//                       </Button>
//                       <Button
//                         variant="outlined"
//                         color="error"
//                         size="small"
//                         onClick={() => handleDeleteUser(user.user_id)}
//                       >
//                         DELETE
//                       </Button>
//                     </TableCell>
//                   </>
//                 )}
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );

//   return isMobile ? renderMobileView() : renderTableView();
// };

// export default UserList;


import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Box, TextField, Select, MenuItem, useMediaQuery, useTheme } from '@mui/material';
import axios from 'axios';

const UserList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);

  // Fetch users data from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8000/get_all_users/');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.mobile_number.includes(searchTerm)
  );

  const handleDeleteUser = async (userName) => {
    try {
      const response = await fetch('http://localhost:8000/delete_user_account/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include any authentication token if required
        },
        body: JSON.stringify({ user_name: userName })  // Send the user name as part of the request body
      });
  
      if (response.ok) {
        // Handle successful deletion, e.g., update the state, show a success message, etc.
        alert("Account deleted successfully!");
        // You might also want to redirect the user to a different page
      } else {
        const errorData = await response.json();
        alert(errorData.detail);  // Display the error message from the API
      }
    } catch (error) {
      console.error("Error deleting user account:", error);
      alert("An error occurred while deleting the account.");
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      const response = await axios.post("http://localhost:8000/change_role/", {
        user_name: userId,
        new_role: newRole
      });
      alert(response.data.detail);
      // Optionally, update the local state with the new role after successful change
      setUsers(users.map(user =>
        user.user_id === userId ? { ...user, isEditing: false, role: newRole } : user
      ));
    } catch (error) {
      alert("Error updating role: " + error.response?.data.detail || error.message);
    }
  };
  

  const handleEditUser = (userId) => {
    setUsers(users.map(user => 
      user.user_id === userId 
        ? { ...user, isEditing: true, originalUser: { ...user } }
        : user
    ));
  };

  const handleSaveUser = (userId) => {
    setUsers(users.map(user => 
      user.user_id === userId 
        ? { ...user, isEditing: false, originalUser: undefined }
        : user
    ));
  };

  const handleCancelEdit = (userId) => {
    setUsers(users.map(user => 
      user.user_id === userId 
        ? { ...user.originalUser, isEditing: false, originalUser: undefined }
        : user
    ));
  };

  const handleFieldChange = (userId, field, value) => {
    // Allow editing only the 'role' field
    if (field === 'role') {
      setUsers(users.map(user => 
        user.user_id === userId 
          ? { ...user, [field]: value }
          : user
      ));
    }
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
          key={user.user_id} 
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
                value={user.user_name}
                onChange={(e) => handleFieldChange(user.user_id, 'user_name', e.target.value)}
                margin="dense"
              />
              <TextField
                fullWidth
                label="Email"
                value={user.email}
                onChange={(e) => handleFieldChange(user.user_id, 'email', e.target.value)}
                margin="dense"
              />
              <TextField
                fullWidth
                label="Mobile Number"
                value={user.mobile_number}
                onChange={(e) => handleFieldChange(user.user_id, 'mobile_number', e.target.value)}
                margin="dense"
              />
              <Select
                fullWidth
                label="Role"
                value={user.role}
                onChange={(e) => handleFieldChange(user.user_id, 'role', e.target.value)}
                margin="dense"
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="delivery">Delivery Man</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </Select>
              <Select
                fullWidth
                value={user.is_active ? "Active" : "Inactive"}
                onChange={(e) => handleFieldChange(user.user_id, 'is_active', e.target.value === "Active")}
                margin="dense"
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
              <Box sx={{ display: 'flex', gap: 1, marginTop: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => handleChangeRole(user.user_name, user.role)}
                >
                  DONE
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  onClick={() => handleCancelEdit(user.user_id)}
                >
                  CANCEL
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {user.user_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.role}
                </Typography>
              </Box>
              <Typography variant="body2">
                {user.email}
              </Typography>
              <Typography variant="body2">
                Mobile: {user.mobile_number}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 
                    user.is_active ? 'green' : 'orange'
                }}
              >
                Status: {user.is_active ? 'Active' : 'Inactive'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, marginTop: 1 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  fullWidth
                  onClick={() => handleEditUser(user.user_id)}
                >
                  EDIT
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  fullWidth
                  onClick={() => handleDeleteUser(user.user_name)}
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
              <TableCell>Mobile Number</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.user_id}>
                <TableCell>{user.user_name}</TableCell>
                {!isMobile && <TableCell>{user.email}</TableCell>}
                <TableCell>{user.mobile_number}</TableCell>
                <TableCell>
                  {user.isEditing ? (
                    <Select
                      value={user.role}
                      onChange={(e) => handleFieldChange(user.user_id, 'role', e.target.value)}
                    >
                      <MenuItem value="admin">Admin</MenuItem>
                      <MenuItem value="delivery">Delivery Man</MenuItem>
                      <MenuItem value="user">User</MenuItem>
                    </Select>
                  ) : (
                    user.role
                  )}
                </TableCell>
                <TableCell>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 
                        user.is_active ? 'green' : 'orange'
                    }}
                  >
                    {user.is_active ? 'Active' : 'Inactive'}
                  </Typography>
                </TableCell>
                <TableCell>
                  {user.isEditing ? (
                    <>
                      <Button 
                        variant="contained"
                        color="primary"
                        onClick={() => handleChangeRole(user.user_name, user.role)}
                      >
                        DONE
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleCancelEdit(user.user_id)}
                      >
                        CANCEL
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleEditUser(user.user_id)}
                      >
                        EDIT
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteUser(user.user_name)}
                      >
                        DELETE
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  return isMobile ? renderMobileView() : renderTableView();
};

export default UserList;
