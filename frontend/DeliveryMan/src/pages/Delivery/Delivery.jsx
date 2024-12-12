import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  TextField, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  IconButton,
  Box,
  Paper,
  createTheme,
  ThemeProvider,
  useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Custom theme for professional look
const theme = createTheme({
  palette: {
    primary: {
      main: '#2a6496', // Deep blue
      light: '#4a8bc2'
    },
    background: {
      default: '#f4f6f9',
      paper: '#ffffff'
    },
    text: {
      primary: '#2c3e50',
      secondary: '#7f8c8d'
    },
    success: {
      main: '#27ae60'
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: '#2c3e50',
      letterSpacing: '-0.5px'
    },
    body1: {
      color: '#34495e'
    }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 6px 15px rgba(0,0,0,0.12)'
          }
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        outlined: {
          borderColor: 'rgba(42, 100, 150, 0.2)',
          borderRadius: 8
        }
      }
    }
  }
});

const DeliveryTaskApp = () => {
  // Mock data for delivery tasks
  const initialTasks = [
    {
      id: 1,
      customerName: "John Doe",
      address: "123 Main St, Cityville, Long Address State",
      contactNumber: "+1 (555) 123-4567",
      items: [
        { name: "Pizza Margherita", quantity: 2 },
        { name: "Coca Cola", quantity: 1 }
      ],
      totalAmount: 25.50,
      expectedPin: "1234"
    },
    {
      id: 2,
      customerName: "Jane Smith",
      address: "456 Oak Avenue, Townsburg, Another Long Address",
      contactNumber: "+1 (555) 987-6543",
      items: [
        { name: "Burger Combo", quantity: 1 },
        { name: "French Fries", quantity: 1 }
      ],
      totalAmount: 15.75,
      expectedPin: "5678"
    },
    {
      id: 3,
      customerName: "Alex Johnson",
      address: "789 Pine Road, Villagetown",
      contactNumber: "+1 (555) 246-8101",
      items: [
        { name: "Salad", quantity: 1 },
        { name: "Mineral Water", quantity: 2 }
      ],
      totalAmount: 20.25,
      expectedPin: "9012"
    }
  ];

  const [tasks, setTasks] = useState(initialTasks);
  const [selectedTask, setSelectedTask] = useState(null);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const handleTaskSelect = (task) => {
    setSelectedTask(task);
    setPinInput('');
    setPinError(false);
  };

  const handlePinSubmit = () => {
    if (selectedTask && pinInput === selectedTask.expectedPin) {
      // Complete the order
      setTasks(tasks.filter(task => task.id !== selectedTask.id));
      setSelectedTask(null);
    } else {
      setPinError(true);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container 
        maxWidth="lg" 
        sx={{ 
          backgroundColor: 'background.default', 
          minHeight: '100vh', 
          py: 4 
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            mb: 4,
            gap: 2
          }}
        >
          <LocalShippingIcon 
            color="primary" 
            sx={{ fontSize: 40 }} 
          />
          <Typography 
            variant="h4" 
            component="h1" 
            align="center"
          >
            Delivery Tasks
          </Typography>
        </Box>
        
        {/* Responsive Grid Layout for Tasks */}
        <Grid container spacing={3}>
          {tasks.map(task => (
            <Grid item xs={12} sm={6} md={4} key={task.id}>
              <Card 
                variant="elevation"
                sx={{ 
                  cursor: 'pointer', 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
                onClick={() => handleTaskSelect(task)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography 
                      variant="subtitle1" 
                      fontWeight="bold" 
                      color="primary"
                    >
                      Order #{task.id}
                    </Typography>
                    <LocalShippingIcon 
                      color="action" 
                      sx={{ opacity: 0.6 }} 
                    />
                  </Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 1, 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis' 
                    }}
                  >
                    {task.customerName}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 1, 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis' 
                    }}
                  >
                    {task.address}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    color="primary" 
                    sx={{ fontWeight: 'bold', textAlign: 'right' }}
                  >
                    ${task.totalAmount.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Task Details Dialog */}
        <Dialog 
          open={!!selectedTask} 
          onClose={() => setSelectedTask(null)}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            elevation: 4,
            sx: {
              borderRadius: 3
            }
          }}
        >
          {selectedTask && (
            <>
              <DialogTitle 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  borderBottom: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <LocalShippingIcon color="primary" />
                  <Typography variant="h6" color="primary">
                    Order #{selectedTask.id} Details
                  </Typography>
                </Box>
                <IconButton 
                  onClick={() => setSelectedTask(null)}
                  edge="end"
                  color="error"
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {/* Customer Details */}
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 2, 
                      backgroundColor: 'background.default' 
                    }}
                  >
                    <Typography variant="subtitle1" color="primary" sx={{ mb: 1 }}>
                      Customer Information
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body1">
                          <strong>Name:</strong> {selectedTask.customerName}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body1">
                          <strong>Contact:</strong> {selectedTask.contactNumber}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body1">
                          <strong>Address:</strong> {selectedTask.address}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>

                  {/* Order Items */}
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 2, 
                      backgroundColor: 'background.default' 
                    }}
                  >
                    <Typography 
                      variant="subtitle1" 
                      color="primary" 
                      sx={{ mb: 2 }}
                    >
                      Order Items
                    </Typography>
                    <List dense>
                      {selectedTask.items.map((item, index) => (
                        <ListItem 
                          key={index} 
                          disableGutters
                          sx={{ 
                            borderBottom: index < selectedTask.items.length - 1 
                              ? '1px solid' 
                              : 'none', 
                            borderColor: 'divider',
                            py: 1
                          }}
                        >
                          <ListItemText 
                            primary={item.name}
                            primaryTypographyProps={{ 
                              variant: 'body1',
                              color: 'text.primary'
                            }}
                            secondary={`Quantity: ${item.quantity}`}
                            secondaryTypographyProps={{ 
                              color: 'text.secondary'
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                    <Typography 
                      variant="h6" 
                      color="primary" 
                      align="right" 
                      sx={{ mt: 2, fontWeight: 'bold' }}
                    >
                      Total: ${selectedTask.totalAmount.toFixed(2)}
                    </Typography>
                  </Paper>

                  {/* PIN Input */}
                  <TextField
                    fullWidth
                    label="Enter Customer PIN to Complete Delivery"
                    variant="outlined"
                    value={pinInput}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setPinInput(value.slice(0, 4));
                    }}
                    error={pinError}
                    helperText={pinError ? "Incorrect PIN. Please try again." : ""}
                    inputProps={{ 
                      maxLength: 4,
                      inputMode: 'numeric'
                    }}
                    color="primary"
                  />

                  {/* Complete Delivery Button */}
                  <Button 
                    fullWidth 
                    variant="contained" 
                    color="primary"
                    onClick={handlePinSubmit}
                    disabled={pinInput.length !== 4}
                    startIcon={<CheckCircleIcon />}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1rem'
                    }}
                  >
                    Complete Delivery
                  </Button>
                </Box>
              </DialogContent>
            </>
          )}
        </Dialog>

        {/* Empty State */}
        {tasks.length === 0 && (
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '50vh',
              textAlign: 'center'
            }}
          >
            <CheckCircleIcon 
              color="success" 
              sx={{ fontSize: 80, mb: 2, opacity: 0.7 }} 
            />
            <Typography 
              variant="h5" 
              color="text.secondary" 
              sx={{ mb: 1 }}
            >
              All Deliveries Completed
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
            >
              You have no pending delivery tasks
            </Typography>
          </Box>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default DeliveryTaskApp;