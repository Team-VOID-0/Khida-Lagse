// import React, { useState } from 'react';
// import { 
//   Box, 
//   Button, 
//   TextField, 
//   Typography, 
//   Paper, 
//   useMediaQuery, 
//   useTheme 
// } from '@mui/material';

// const AddFoodItem = ({ onAddItem }) => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

//   const [newItem, setNewItem] = useState({
//     name: '',
//     category: '',
//     price: '',
//     description: '',
//     image: null, // For storing the uploaded image file
//   });

//   const handleInputChange = (field, value) => {
//     setNewItem(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0]; // Get the first uploaded file
//     setNewItem(prev => ({
//       ...prev,
//       image: file
//     }));
//   };

//   const handleAddItem = () => {
//     // Basic validation
//     if (!newItem.name || !newItem.price) {
//       alert('Name and price are required!');
//       return;
//     }

//     // Generate a unique ID (in a real app, this would typically come from a backend)
//     const newItemWithId = {
//       ...newItem,
//       id: Date.now(), // Simple way to generate a unique ID
//       isEditing: false
//     };

//     // Call the parent component's add item method
//     onAddItem(newItemWithId);

//     // Reset the form
//     setNewItem({
//       name: '',
//       category: '',
//       price: '',
//       description: '',
//       image: null,
//     });
//   };

//   return (
//     <Box 
//       sx={{ 
//         width: '100%', 
//         display: 'flex', 
//         justifyContent: 'center', 
//         padding: 2 
//       }}
//     >
//       <Paper 
//         elevation={3} 
//         sx={{ 
//           width: isMobile ? '100%' : '600px', 
//           padding: 3,
//           display: 'flex',
//           flexDirection: 'column',
//           gap: 2
//         }}
//       >
//         <Typography 
//           variant="h6" 
//           sx={{ 
//             textAlign: 'center', 
//             marginBottom: 2 
//           }}
//         >
//           Add New Food Item
//         </Typography>
        
//         <TextField
//           fullWidth
//           label="Name"
//           value={newItem.name}
//           onChange={(e) => handleInputChange('name', e.target.value)}
//           required
//           margin="dense"
//         />
        
//         <TextField
//           fullWidth
//           label="Category"
//           value={newItem.category}
//           onChange={(e) => handleInputChange('category', e.target.value)}
//           margin="dense"
//         />
        
//         <TextField
//           fullWidth
//           label="Price"
//           value={newItem.price}
//           onChange={(e) => handleInputChange('price', e.target.value)}
//           required
//           margin="dense"
//           placeholder="$XX.XX"
//         />

//         {/* Image Upload Field */}
//         <TextField
//           fullWidth
//           type="file"
//           inputProps={{ accept: 'image/*' }} // Allow only image files
//           onChange={handleImageUpload}
//           margin="dense"
//           helperText={newItem.image ? `Selected file: ${newItem.image.name}` : 'Upload an image for the food item'}
//         />

//         <TextField
//           fullWidth
//           label="Description"
//           value={newItem.description}
//           onChange={(e) => handleInputChange('description', e.target.value)}
//           margin="dense"
//           multiline
//           rows={3}
//         />
        
//         <Button
//           variant="contained"
//           color="primary"
//           fullWidth
//           onClick={handleAddItem}
//           sx={{ marginTop: 2 }}
//         >
//           ADD ITEM
//         </Button>
//       </Paper>
//     </Box>
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
    description: '',
    image: null, // For storing the uploaded image file
  });

  const categories = [
    'Salad',
    'Rolls',
    'Desserts',
    'Sandwich',
    'Cake',
    'Pure Veg',
    'Pasta',
    'Noodles',
  ];

  const handleInputChange = (field, value) => {
    setNewItem((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0]; // Get the first uploaded file
    setNewItem((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.price || !newItem.description || !newItem.category || !newItem.image) {
        alert("All fields are required.");
        return;
    }

    const formData = new FormData();
    formData.append("name", newItem.name);
    formData.append("category", newItem.category);
    formData.append("price", parseFloat(newItem.price)); // Ensure price is a float
    formData.append("description", newItem.description);
    formData.append("image", newItem.image); // Must be a File object

    try {
        const response = await fetch("http://127.0.0.1:8000/food/", {
            method: "POST",
            body: formData, // Sending FormData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        alert("Food item added successfully!");
        console.log("Response:", data);
    } catch (error) {
        console.error("Error adding food item:", error);
        alert("Failed to add food item.");
    }
};


  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        padding: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: isMobile ? '100%' : '600px',
          padding: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            textAlign: 'center',
            marginBottom: 2,
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
          select
          label="Category"
          value={newItem.category}
          onChange={(e) => handleInputChange('category', e.target.value)}
          required
          margin="dense"
        >
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          label="Price"
          value={newItem.price}
          onChange={(e) => handleInputChange('price', e.target.value)}
          required
          margin="dense"
          placeholder="$XX.XX"
        />

        {/* Image Upload Field */}
        <TextField
          fullWidth
          type="file"
          inputProps={{ accept: 'image/*' }} // Allow only image files
          onChange={handleImageUpload}
          margin="dense"
          helperText={
            newItem.image
              ? `Selected file: ${newItem.image.name}`
              : 'Upload an image for the food item'
          }
        />

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
