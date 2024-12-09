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

const FoodItemList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const [searchTerm, setSearchTerm] = useState('');
  const [foodItems, setFoodItems] = useState([
    { 
      id: 1, 
      name: 'Margherita Pizza', 
      category: 'Pizza', 
      price: '$12.99', 
      status: 'Available', 
      description: 'Classic pizza with tomato sauce, mozzarella, and basil',
      isEditing: false
    },
    { 
      id: 2, 
      name: 'Caesar Salad', 
      category: 'Salad', 
      price: '$8.50', 
      status: 'Available', 
      description: 'Crisp romaine lettuce with Caesar dressing',
      isEditing: false
    },
    { 
      id: 3, 
      name: 'Chicken Burger', 
      category: 'Burger', 
      price: '$14.25', 
      status: 'Low Stock', 
      description: 'Grilled chicken burger with special sauce',
      isEditing: false
    },
    { 
      id: 4, 
      name: 'Vegetable Pasta', 
      category: 'Pasta', 
      price: '$11.75', 
      status: 'Available', 
      description: 'Fresh pasta with seasonal vegetables',
      isEditing: false
    },
    { 
      id: 5, 
      name: 'Chocolate Brownie', 
      category: 'Dessert', 
      price: '$6.50', 
      status: 'Out of Stock', 
      description: 'Rich chocolate brownie with vanilla ice cream',
      isEditing: false
    },
  ]);

  const filteredFoodItems = useMemo(() => {
    return foodItems.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.price.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [foodItems, searchTerm]);

  const handleDeleteItem = (itemId) => {
    setFoodItems(foodItems.filter(item => item.id !== itemId));
  };

  const handleEditItem = (itemId) => {
    setFoodItems(foodItems.map(item => 
      item.id === itemId 
        ? { ...item, isEditing: true, originalItem: { ...item } }
        : item
    ));
  };

  const handleSaveItem = (itemId) => {
    setFoodItems(foodItems.map(item => 
      item.id === itemId 
        ? { ...item, isEditing: false, originalItem: undefined }
        : item
    ));
  };

  const handleCancelEdit = (itemId) => {
    setFoodItems(foodItems.map(item => 
      item.id === itemId 
        ? { ...item.originalItem, isEditing: false, originalItem: undefined }
        : item
    ));
  };

  const handleFieldChange = (itemId, field, value) => {
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
              <Select
                fullWidth
                value={item.status}
                onChange={(e) => handleFieldChange(item.id, 'status', e.target.value)}
                margin="dense"
              >
                <MenuItem value="Available">Available</MenuItem>
                <MenuItem value="Low Stock">Low Stock</MenuItem>
                <MenuItem value="Out of Stock">Out of Stock</MenuItem>
              </Select>
              <TextField
                fullWidth
                label="Description"
                value={item.description}
                onChange={(e) => handleFieldChange(item.id, 'description', e.target.value)}
                margin="dense"
                multiline
                rows={3}
              />
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
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 
                    item.status === 'Available' ? 'green' : 
                    item.status === 'Low Stock' ? 'orange' : 
                    'red'
                }}
              >
                Status: {item.status}
              </Typography>
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
              <TableCell>Status</TableCell>
              {!isMobile && <TableCell>Description</TableCell>}
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
                    <TableCell>
                      <Select
                        value={item.status}
                        onChange={(e) => handleFieldChange(item.id, 'status', e.target.value)}
                        fullWidth
                      >
                        <MenuItem value="Available">Available</MenuItem>
                        <MenuItem value="Low Stock">Low Stock</MenuItem>
                        <MenuItem value="Out of Stock">Out of Stock</MenuItem>
                      </Select>
                    </TableCell>
                    {!isMobile && (
                      <TableCell>
                        <TextField
                          value={item.description}
                          onChange={(e) => handleFieldChange(item.id, 'description', e.target.value)}
                          fullWidth
                          multiline
                          rows={2}
                        />
                      </TableCell>
                    )}
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
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 
                            item.status === 'Available' ? 'green' : 
                            item.status === 'Low Stock' ? 'orange' : 
                            'red'
                        }}
                      >
                        {item.status}
                      </Typography>
                    </TableCell>
                    {!isMobile && (
                      <TableCell>
                        <Typography variant="body2" noWrap>
                          {item.description}
                        </Typography>
                      </TableCell>
                    )}
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 1 }}>
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          onClick={() => handleEditItem(item.id)}
                          sx={{ minWidth: isMobile ? '100%' : 'auto' }}
                        >
                          EDIT
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleDeleteItem(item.id)}
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

export default FoodItemList;