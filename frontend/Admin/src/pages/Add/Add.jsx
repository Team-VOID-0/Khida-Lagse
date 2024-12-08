// import React, { useState } from 'react';
// import { Button, TextField, MenuItem, Select, InputLabel, FormControl, TextareaAutosize } from '@mui/material';

// const AddFoodItem = () => {
//   const [foodItem, setFoodItem] = useState({
//     name: '',
//     price: '',
//     category: '',
//     description: '',
//     image: null
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFoodItem(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     setFoodItem(prev => ({
//       ...prev,
//       image: file
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Add logic to submit the food item
//     console.log('Food Item Submitted:', foodItem);
//   };

//   return (
//     <div className="p-6 max-w-2xl mx-auto">
//       <h2 className="text-2xl font-bold mb-6">Add New Food Item</h2>
//       <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
//         <div>
//           <TextField
//             label="Food Item Name"
//             id="name"
//             name="name"
//             value={foodItem.name}
//             onChange={handleInputChange}
//             fullWidth
//             required
//           />
//         </div>

//         <div>
//           <TextField
//             label="Price"
//             id="price"
//             name="price"
//             type="number"
//             value={foodItem.price}
//             onChange={handleInputChange}
//             fullWidth
//             required
//           />
//         </div>

//         <div>
//           <FormControl fullWidth>
//             <InputLabel>Category</InputLabel>
//             <Select
//               name="category"
//               value={foodItem.category}
//               onChange={(e) => handleInputChange(e)}
//               required
//             >
//               <MenuItem value="appetizer">Appetizer</MenuItem>
//               <MenuItem value="main-course">Main Course</MenuItem>
//               <MenuItem value="dessert">Dessert</MenuItem>
//               <MenuItem value="beverage">Beverage</MenuItem>
//             </Select>
//           </FormControl>
//         </div>

//         <div>
//           <TextareaAutosize
//             minRows={4}
//             name="description"
//             value={foodItem.description}
//             onChange={handleInputChange}
//             placeholder="Enter food item description"
//             style={{ width: '100%', padding: '8px' }}
//           />
//         </div>

//         <div>
//           <input
//             type="file"
//             id="image"
//             name="image"
//             accept="image/*"
//             onChange={handleImageUpload}
//           />
//         </div>

//         <Button type="submit" variant="contained" color="primary" fullWidth>
//           Add Food Item
//         </Button>
//       </form>
//     </div>
//   );
// };

// export default AddFoodItem;


import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  Select, 
  MenuItem,
  useMediaQuery,
  useTheme
} from '@mui/material';

const AddFoodItem = ({ onAddItem }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    price: '',
    status: 'Available',
    description: ''
  });

  const handleInputChange = (field, value) => {
    setNewItem(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddItem = () => {
    // Basic validation
    if (!newItem.name || !newItem.price) {
      alert('Name and price are required!');
      return;
    }

    // Generate a unique ID (in a real app, this would typically come from a backend)
    const newItemWithId = {
      ...newItem,
      id: Date.now(), // Simple way to generate a unique ID
      isEditing: false
    };

    // Call the parent component's add item method
    onAddItem(newItemWithId);

    // Reset the form
    setNewItem({
      name: '',
      category: '',
      price: '',
      status: 'Available',
      description: ''
    });
  };

  return (
    <Box 
      sx={{ 
        width: '100%', 
        display: 'flex', 
        justifyContent: 'center', 
        padding: 2 
      }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          width: isMobile ? '100%' : '600px', 
          padding: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            textAlign: 'center', 
            marginBottom: 2 
          }}
        >
          Add New Food Item
        </Typography>
        
        <TextField
          fullWidth
          label="Name"
          value={newItem.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          required
          margin="dense"
        />
        
        <TextField
          fullWidth
          label="Category"
          value={newItem.category}
          onChange={(e) => handleInputChange('category', e.target.value)}
          margin="dense"
        />
        
        <TextField
          fullWidth
          label="Price"
          value={newItem.price}
          onChange={(e) => handleInputChange('price', e.target.value)}
          required
          margin="dense"
          placeholder="$XX.XX"
        />
        
        <Select
          fullWidth
          value={newItem.status}
          onChange={(e) => handleInputChange('status', e.target.value)}
          margin="dense"
        >
          <MenuItem value="Available">Available</MenuItem>
          <MenuItem value="Low Stock">Low Stock</MenuItem>
          <MenuItem value="Out of Stock">Out of Stock</MenuItem>
        </Select>
        
        <TextField
          fullWidth
          label="Description"
          value={newItem.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          margin="dense"
          multiline
          rows={3}
        />
        
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleAddItem}
          sx={{ marginTop: 2 }}
        >
          ADD ITEM
        </Button>
      </Paper>
    </Box>
  );
};

export default AddFoodItem;