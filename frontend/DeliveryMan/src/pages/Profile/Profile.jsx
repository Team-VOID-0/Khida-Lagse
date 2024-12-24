
import React, { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'; // Install this library using `npm install jwt-decode`
import { 
  Box, 
  Typography, 
  Paper, 
  Avatar, 
  Grid, 
  Button, 
  TextField, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  IconButton,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Camera as CameraIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon 
} from '@mui/icons-material';
import axios from 'axios';
const AdminProfile = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // State for Admin profile data
  const [adminData, setAdminData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Admin',
    avatar: null
  });

  // Modal states
  const [openProfileEdit, setOpenProfileEdit] = useState(false);
  const [openPasswordEdit, setOpenPasswordEdit] = useState(false);

  // Temporary edit states
  const [editedData, setEditedData] = useState({ ...adminData });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Function to handle profile image upload
  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdminData(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Fetch admin data from the token
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Assuming the token contains fields `name`, `email`, and `phone`
        setAdminData({
          name: decoded.name,
          email: decoded.email,
          phone: decoded.mobile,
          role: decoded.role,
          avatar: null
        });
      } catch (error) {
        console.error('Invalid token', error);
      }
    }
  }, []);

  const handleSaveChanges = async () => {
    const token = localStorage.getItem("access_token");
  
    try {
      const payload = {
        user_name: jwtDecode(token).sub,
        user_id: "123",
        name: editedData.name,
        email: editedData.email,
        mobile_number: editedData.phone, // Confirm this field name with the backend
      };
  
      console.log("Payload being sent:", payload);
  
      const response = await axios.put(
        "http://localhost:8000/user_update/",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.status === 200) {
        setAdminData(editedData); 
        setOpenProfileEdit(false);
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error.message);
      alert(
        error.response?.data?.detail[0]?.msg || 
        "Failed to update profile. Please check the input fields."
      );
    }
  };
  

  // Profile Edit Modal
  const ProfileEditModal = () => (
    <Dialog 
      open={openProfileEdit} 
      onClose={() => setOpenProfileEdit(false)}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          mb: 2 
        }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar 
              src={adminData.avatar} 
              sx={{ 
                width: 100, 
                height: 100, 
                mb: 2 
              }} 
            />
            <IconButton
              component="label"
              sx={{ 
                position: 'absolute', 
                bottom: 10, 
                right: -10,
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': { backgroundColor: 'primary.dark' }
              }}
            >
              <CameraIcon />
              <input 
                type="file" 
                hidden 
                accept="image/*"
                onChange={handleAvatarUpload}
              />
            </IconButton>
          </Box>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Name"
              value={editedData.name}
              onChange={(e) => setEditedData(prev => ({ ...prev, name: e.target.value }))}
              InputProps={{
                startAdornment: <PersonIcon sx={{ mr: 1, color: 'action.active' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              value={editedData.email}
              onChange={(e) => setEditedData(prev => ({ ...prev, email: e.target.value }))}
              InputProps={{
                startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Phone Number"
              value={editedData.phone}
              onChange={(e) => setEditedData(prev => ({ ...prev, phone: e.target.value }))}
              InputProps={{
                startAdornment: <PhoneIcon sx={{ mr: 1, color: 'action.active' }} />
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={() => setOpenProfileEdit(false)}
          color="secondary"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSaveChanges}
          color="primary"
          variant="contained"
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Password Change Modal
  const PasswordChangeModal = () => (
    <Dialog 
      open={openPasswordEdit} 
      onClose={() => setOpenPasswordEdit(false)}
      fullWidth
      maxWidth="sm"
    >
      {/* Password modal content */}
    </Dialog>
  );

  return (
    <Box sx={{ 
      flexGrow: 1, 
      padding: isMobile ? 2 : 4 
    }}>
      <Paper 
        elevation={3} 
        sx={{ 
          padding: isMobile ? 2 : 4, 
          maxWidth: 800, 
          margin: 'auto' 
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          mb: 4 
        }}>
          <Avatar 
            src={adminData.avatar} 
            sx={{ 
              width: 150, 
              height: 150, 
              mb: 2 
            }} 
          />
          <Typography variant="h5" gutterBottom>
            {adminData.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {adminData.role}
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PersonIcon sx={{ mr: 2, color: 'action.active' }} />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Full Name
                </Typography>
                <Typography variant="body1">
                  {adminData.name}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <EmailIcon sx={{ mr: 2, color: 'action.active' }} />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Email Address
                </Typography>
                <Typography variant="body1">
                  {adminData.email}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PhoneIcon sx={{ mr: 2, color: 'action.active' }} />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Phone Number
                </Typography>
                <Typography variant="body1">
                  {adminData.phone}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 2, 
          mt: 4 
        }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            onClick={() => {
              setEditedData(adminData);
              setOpenProfileEdit(true);
            }}
          >
            Edit Profile
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<LockIcon />}
            onClick={() => setOpenPasswordEdit(true)}
          >
            Change Password
          </Button>
        </Box>

        {/* Modals */}
        <ProfileEditModal />
        <PasswordChangeModal />
      </Paper>
    </Box>
  );
};

export default AdminProfile;
