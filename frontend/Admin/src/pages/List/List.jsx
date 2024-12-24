import React, { useState, useEffect, useMemo } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Box, TextField, useMediaQuery, useTheme } from '@mui/material';
import axios from 'axios';

const FoodItemList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const [searchTerm, setSearchTerm] = useState('');
  const [foodItems, setFoodItems] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/foods/')
      .then(response => {
        if (Array.isArray(response.data)) {
          setFoodItems(response.data.map(item => ({
            ...item,
            price: item.price.toString()
          })));
        } else {
          console.error('Unexpected data format:', response.data);
        }
      })
      .catch(error => console.error('Error fetching food items:', error));
  }, []);

  const filteredFoodItems = useMemo(() => {
    return foodItems.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.price.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [foodItems, searchTerm]);

  const handleDeleteItem = (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }
  
    axios.delete(`http://localhost:8000/food/${itemId}/`)
      .then(response => {
        console.log(response.data);
        // Update the local state to reflect deletion
        setFoodItems(foodItems.filter(item => item.id !== itemId));
        alert('Food item deleted successfully!');
      })
      .catch(error => {
        console.error('Error deleting food item:', error.response?.data || error.message);
        alert('Failed to delete the food item. Please try again.');
      });
  };
  

  const handleEditItem = (itemId) => {
    setFoodItems(foodItems.map(item => 
      item.id === itemId 
        ? { ...item, isEditing: true, originalItem: { ...item } }
        : item
    ));
  };

  const handleSaveItem = (itemId) => {
    const itemToSave = foodItems.find(item => item.id === itemId);
    if (!itemToSave) return;
    console.log(itemId);
  
    // Basic validation
    if (!itemToSave.name.trim() || !itemToSave.price.trim() || !itemToSave.category.trim()) {
      alert('Please ensure all fields are filled out correctly.');
      return;
    }
    console.log({
      name: itemToSave.name.trim(),
      price: itemToSave.price.trim(),
      description: itemToSave.description.trim(),
      category: itemToSave.category.trim()
    })
    
    axios.put(`http://localhost:8000/food/${itemId}/`, {
      name: itemToSave.name.trim(),
      price: toString(itemToSave.price).trim(),
      description: itemToSave.description.trim(),
      category: itemToSave.category.trim()
    })
      .then(response => {
        console.log(response.data);
        setFoodItems(foodItems.map(item =>
          item.id === itemId
            ? { ...item, isEditing: false, originalItem: undefined }
            : item
        ));
      })
      .catch(error => {
        console.error('Error updating food item:', error.response?.data || error.message);
        alert('Failed to save changes. Please check your input and try again.');
      });
  };
  
  

  const handleCancelEdit = (itemId) => {
    setFoodItems(foodItems.map(item => 
      item.id === itemId 
        ? { ...item.originalItem, isEditing: false, originalItem: undefined }
        : item
    ));
  };

  const handleFieldChange = (itemId, field, value) => {
    if (field === 'image_url') return;
    setFoodItems(foodItems.map(item => 
      item.id === itemId 
        ? { ...item, [field]: value }
        : item
    ));
  };

  // Mobile view render
  const renderMobileView = () => (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <TextField
        fullWidth
        variant="outlined"
        label="Search Food Items"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ margin: 2, marginBottom: 3 }}
      />
      {filteredFoodItems.map((item) => (
        <Paper 
          key={item.id} 
          elevation={3} 
          sx={{ 
            margin: 2, 
            padding: 2, 
            display: 'flex', 
            flexDirection: 'column',
            gap: 1
          }}
        >
          {item.isEditing ? (
            <>
              <TextField
                fullWidth
                label="Name"
                value={item.name}
                onChange={(e) => handleFieldChange(item.id, 'name', e.target.value)}
                margin="dense"
              />
              <TextField
                fullWidth
                label="Category"
                value={item.category}
                onChange={(e) => handleFieldChange(item.id, 'category', e.target.value)}
                margin="dense"
              />
              <TextField
                fullWidth
                label="Price"
                value={item.price}
                onChange={(e) => handleFieldChange(item.id, 'price', e.target.value)}
                margin="dense"
              />
              <TextField
                fullWidth
                label="Description"
                value={item.description}
                onChange={(e) => handleFieldChange(item.id, 'description', e.target.value)}
                margin="dense"
                multiline
                rows={3}
              />
              {/* <TextField
                fullWidth
                label="Image URL"
                value={item.image_url}
                onChange={(e) => handleFieldChange(item.id, 'image', e.target.value)}
                margin="dense"
                multiline
                rows={1}
              /> */}
              <Box sx={{ display: 'flex', gap: 1, marginTop: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => handleSaveItem(item.id)}
                >
                  DONE
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  onClick={() => handleCancelEdit(item.id)}
                >
                  CANCEL
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.category}
                </Typography>
              </Box>
              <Typography variant="body2">
                {item.description}
              </Typography>
              <Typography variant="body1">
                Price: {item.price}
              </Typography>
              {item.image && (
                <Box sx={{ marginTop: 1 }}>
                  <img src={item.image} alt={item.name} style={{ width: '100%', height: 'auto' }} />
                </Box>
              )}
              <Box sx={{ display: 'flex', gap: 1, marginTop: 1 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  fullWidth
                  onClick={() => handleEditItem(item.id)}
                >
                  EDIT
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  fullWidth
                  onClick={() => handleDeleteItem(item.id)}
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
        label="Search Food Items"
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
              <TableCell>Name</TableCell>
              {!isMobile && <TableCell>Category</TableCell>}
              <TableCell>Price</TableCell>
              {!isMobile && <TableCell>Description</TableCell>}
              <TableCell>Image</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredFoodItems.map((item) => (
              <TableRow key={item.id}>
                {item.isEditing ? (
                  <>
                    <TableCell>
                      <TextField
                        value={item.name}
                        onChange={(e) => handleFieldChange(item.id, 'name', e.target.value)}
                        fullWidth
                      />
                    </TableCell>
                    {!isMobile && (
                      <TableCell>
                        <TextField
                          value={item.category}
                          onChange={(e) => handleFieldChange(item.id, 'category', e.target.value)}
                          fullWidth
                        />
                      </TableCell>
                    )}
                    <TableCell>
                      <TextField
                        value={item.price}
                        onChange={(e) => handleFieldChange(item.id, 'price', e.target.value)}
                        fullWidth
                      />
                    </TableCell>
                    {!isMobile && (
                      <TableCell>
                        <TextField
                          value={item.description}
                          onChange={(e) => handleFieldChange(item.id, 'description', e.target.value)}
                          fullWidth
                        />
                      </TableCell>
                    )}
                    <TableCell>
                      <img src={item.image_url} alt={item.name} style={{ width: '100px', height: 'auto' }} />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleSaveItem(item.id)}
                        >
                          DONE
                        </Button>
                        <Button
                          variant="outlined"
                          color="secondary"
                          size="small"
                          onClick={() => handleCancelEdit(item.id)}
                        >
                          CANCEL
                        </Button>
                      </Box>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{item.name}</TableCell>
                    {!isMobile && <TableCell>{item.category}</TableCell>}
                    <TableCell>{item.price}</TableCell>
                    {!isMobile && <TableCell>{item.description}</TableCell>}
                    <TableCell>
                      {item.image_url && <img src={item.image_url} alt={item.name} style={{ width: '100px', height: 'auto' }} />}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          onClick={() => handleEditItem(item.id)}
                        >
                          EDIT
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleDeleteItem(item.id)}
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

  return isMobile || isTablet ? renderMobileView() : renderTableView();
};

export default FoodItemList;
