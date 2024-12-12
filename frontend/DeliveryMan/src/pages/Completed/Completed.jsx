import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Button,
  useTheme,
  alpha,
  IconButton
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CloseIcon from '@mui/icons-material/Close';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { styled } from '@mui/material/styles';

const MinimalistPaper = styled(Paper)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  border: `1px solid ${theme.palette.grey[300]}`,
  boxShadow: 'none',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[4],
    borderColor: theme.palette.primary.main
  }
}));

const HeaderContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  borderBottom: `1px solid ${theme.palette.grey[300]}`,
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}));

const CompletedOrdersDashboard = () => {
  const theme = useTheme();
  const [completedOrders, setCompletedOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const generateMockCompletedOrders = () => {
    const today = new Date();
    return [
      {
        id: 'ORD-001',
        customerName: 'John Doe',
        address: '123 Main St, Cityville',
        totalAmount: 45.50,
        completedAt: today,
        items: [
          { name: 'Pizza Margherita', quantity: 2 },
          { name: 'Coca Cola', quantity: 1 }
        ],
        deliveryTime: '12:30 PM',
        status: 'Delivered'
      },
      {
        id: 'ORD-002',
        customerName: 'Jane Smith',
        address: '456 Oak Avenue, Townsburg',
        totalAmount: 35.75,
        completedAt: today,
        items: [
          { name: 'Burger Combo', quantity: 1 },
          { name: 'French Fries', quantity: 1 }
        ],
        deliveryTime: '1:45 PM',
        status: 'Delivered'
      },
      {
        id: 'ORD-003',
        customerName: 'Alex Johnson',
        address: '789 Pine Road, Villagetown',
        totalAmount: 25.25,
        completedAt: today,
        items: [
          { name: 'Salad', quantity: 1 },
          { name: 'Mineral Water', quantity: 2 }
        ],
        deliveryTime: '2:15 PM',
        status: 'Delivered'
      }
    ];
  };

  useEffect(() => {
    const orders = generateMockCompletedOrders();
    setCompletedOrders(orders);
  }, []);

  const renderOrderDetailsDialog = () => {
    if (!selectedOrder) return null;

    return (
      <Dialog 
        open={!!selectedOrder} 
        onClose={() => setSelectedOrder(null)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: theme.spacing(2),
            border: `1px solid ${theme.palette.grey[300]}`
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: `1px solid ${theme.palette.grey[300]}`,
          p: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <DescriptionOutlinedIcon color="primary" />
            <Typography variant="h6" color="primary">
              Order Details
            </Typography>
          </Box>
          <IconButton onClick={() => setSelectedOrder(null)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" color="textSecondary">
                Order Number
              </Typography>
              <Typography variant="h6" color="primary">
                {selectedOrder.id}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1" color="textSecondary">
                Customer
              </Typography>
              <Typography variant="body1">
                {selectedOrder.customerName}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1" color="textSecondary">
                Delivery Time
              </Typography>
              <Typography variant="body1">
                {selectedOrder.deliveryTime}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" color="textSecondary">
                Delivery Address
              </Typography>
              <Typography variant="body1">
                {selectedOrder.address}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                Order Items
              </Typography>
              {selectedOrder.items.map((item, index) => (
                <Box 
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    py: 1,
                    borderBottom: `1px solid ${theme.palette.divider}`
                  }}
                >
                  <Typography variant="body2">{item.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    × {item.quantity}
                  </Typography>
                </Box>
              ))}
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography 
                variant="h5" 
                align="right" 
                color="primary"
                sx={{ fontWeight: 600 }}
              >
                Total: ${selectedOrder.totalAmount.toFixed(2)}
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <MinimalistPaper>
        <HeaderContainer>
          <Box>
            <Typography variant="h5" color="primary" sx={{ fontWeight: 600 }}>
              Completed Deliveries
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Today's delivery overview
            </Typography>
          </Box>
          <Chip 
            icon={<CheckCircleOutlineIcon />}
            label={`Total: ${completedOrders.length}`}
            color="success"
            variant="outlined"
          />
        </HeaderContainer>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {['Order ID', 'Customer', 'Address', 'Amount', 'Time', 'Status', 'Action'].map((header) => (
                  <TableCell 
                    key={header} 
                    sx={{ 
                      fontWeight: 'bold', 
                      color: theme.palette.text.secondary,
                      textTransform: 'uppercase',
                      fontSize: '0.75rem'
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {completedOrders.map((order) => (
                <TableRow 
                  key={order.id}
                  hover
                  sx={{
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.light, 0.05)
                    }
                  }}
                >
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.address}</TableCell>
                  <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>{order.deliveryTime}</TableCell>
                  <TableCell>
                    <Chip 
                      label={order.status} 
                      color="success" 
                      size="small" 
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Button 
                      startIcon={<LocalShippingIcon />}
                      variant="text"
                      color="primary"
                      size="small"
                      onClick={() => setSelectedOrder(order)}
                    >
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {renderOrderDetailsDialog()}

        {completedOrders.length === 0 && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '50vh',
            textAlign: 'center'
          }}>
            <Typography variant="h6" color="textSecondary">
              No completed deliveries today
            </Typography>
          </Box>
        )}
      </MinimalistPaper>
    </Container>
  );
};

export default CompletedOrdersDashboard;