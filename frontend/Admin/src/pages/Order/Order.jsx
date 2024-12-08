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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme
} from '@mui/material';

const OrderList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const [searchTerm, setSearchTerm] = useState('');
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deliverymen] = useState([
    { id: 1, name: 'Alex Rodriguez' },
    { id: 2, name: 'Maria Garcia' },
    { id: 3, name: 'Chen Wei' },
    { id: 4, name: 'Emma Thompson' },
    { id: 5, name: 'Carlos Mendez' }
  ]);

  const [orders, setOrders] = useState([
    { 
      id: 456, 
      orderNumber: '#456', 
      customer: 'John Doe', 
      total: '$50.75', 
      status: 'Pending', 
      date: '2024-12-06',
      address: '123 Main St, Anytown',
      assignedDeliveryman: null,
    },
    { 
      id: 457, 
      orderNumber: '#457', 
      customer: 'Jane Smith', 
      total: '$75.20', 
      status: 'Pending', 
      date: '2024-12-05',
      address: '456 Oak Avenue, Springfield',
      assignedDeliveryman: null,
    },
    { 
      id: 458, 
      orderNumber: '#458', 
      customer: 'Mike Johnson', 
      total: '$120.99', 
      status: 'Pending', 
      date: '2024-12-04',
      address: '789 Pine Road, Rivertown',
      assignedDeliveryman: null,
    },
    { 
      id: 459, 
      orderNumber: '#459', 
      customer: 'Emily Brown', 
      total: '$90.50', 
      status: 'Pending', 
      date: '2024-12-03',
      address: '321 Elm Street, Lakeside',
      assignedDeliveryman: null,
    },
    { 
      id: 460, 
      orderNumber: '#460', 
      customer: 'David Wilson', 
      total: '$65.30', 
      status: 'Pending', 
      date: '2024-12-02',
      address: '654 Cedar Lane, Mountain View',
      assignedDeliveryman: null,
    },
  ]);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.assignedDeliveryman?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.total.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [orders, searchTerm]);

  const handleDeleteOrder = (orderId) => {
    setOrders(orders.filter(order => order.id !== orderId));
  };

  const handleOpenAssignDialog = (order) => {
    setSelectedOrder(order);
    setOpenAssignDialog(true);
  };

  const handleAssignDeliveryman = (deliveryman) => {
    setOrders(orders.map(order => 
      order.id === selectedOrder.id 
        ? { ...order, assignedDeliveryman: deliveryman, status: 'Processing' }
        : order
    ));
    setOpenAssignDialog(false);
    setSelectedOrder(null);
  };

  const renderAssignDeliverymanDialog = () => (
    <Dialog 
      open={openAssignDialog} 
      onClose={() => setOpenAssignDialog(false)}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Assign Deliveryman</DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          Select a deliveryman for Order {selectedOrder?.orderNumber}
        </Typography>
        {deliverymen.map((deliveryman) => (
          <Button
            key={deliveryman.id}
            variant="outlined"
            fullWidth
            sx={{ margin: 1 }}
            onClick={() => handleAssignDeliveryman(deliveryman)}
          >
            {deliveryman.name}
          </Button>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenAssignDialog(false)} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Mobile view render
  const renderMobileView = () => (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <TextField
        fullWidth
        variant="outlined"
        label="Search Orders"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ margin: 2, marginBottom: 3 }}
      />
      {filteredOrders.map((order) => (
        <Paper 
          key={order.id} 
          elevation={3} 
          sx={{ 
            margin: 2, 
            padding: 2, 
            display: 'flex', 
            flexDirection: 'column',
            gap: 1
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {order.orderNumber}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {order.date}
            </Typography>
          </Box>
          <Typography variant="body1">
            Customer: {order.customer}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Address: {order.address}
          </Typography>
          <Typography variant="body1">
            Total: {order.total}
          </Typography>
          {order.assignedDeliveryman && (
            <Typography variant="body2">
              Assigned to: {order.assignedDeliveryman.name}
            </Typography>
          )}
          <Typography 
            variant="body2" 
            sx={{ 
              color: 
                order.status === 'Completed' ? 'green' : 
                order.status === 'Pending' ? 'orange' : 
                order.status === 'Processing' ? 'blue' : 
                'gray'
            }}
          >
            Status: {order.status}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, marginTop: 1 }}>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              fullWidth
              onClick={() => handleOpenAssignDialog(order)}
            >
              {order.assignedDeliveryman ? 'REASSIGN' : 'ASSIGN'}
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              fullWidth
              onClick={() => handleDeleteOrder(order.id)}
            >
              DELETE
            </Button>
          </Box>
        </Paper>
      ))}
      {renderAssignDeliverymanDialog()}
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
        label="Search Orders"
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
              <TableCell>Order #</TableCell>
              {!isMobile && <TableCell>Customer</TableCell>}
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              {!isMobile && <TableCell>Assigned Deliveryman</TableCell>}
              {!isMobile && <TableCell>Date</TableCell>}
              {!isMobile && <TableCell>Address</TableCell>}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.orderNumber}</TableCell>
                {!isMobile && <TableCell>{order.customer}</TableCell>}
                <TableCell>{order.total}</TableCell>
                <TableCell>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 
                        order.status === 'Completed' ? 'green' : 
                        order.status === 'Pending' ? 'orange' : 
                        order.status === 'Processing' ? 'blue' : 
                        'gray'
                    }}
                  >
                    {order.status}
                  </Typography>
                </TableCell>
                {!isMobile && (
                  <TableCell>
                    {order.assignedDeliveryman 
                      ? order.assignedDeliveryman.name 
                      : 'Not Assigned'}
                  </TableCell>
                )}
                {!isMobile && <TableCell>{order.date}</TableCell>}
                {!isMobile && (
                  <TableCell>
                    <Typography variant="body2" noWrap>
                      {order.address}
                    </Typography>
                  </TableCell>
                )}
                <TableCell>
                  <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 1 }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => handleOpenAssignDialog(order)}
                      sx={{ minWidth: isMobile ? '100%' : 'auto' }}
                    >
                      {order.assignedDeliveryman ? 'REASSIGN' : 'ASSIGN'}
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDeleteOrder(order.id)}
                      sx={{ minWidth: isMobile ? '100%' : 'auto' }}
                    >
                      DELETE
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {renderAssignDeliverymanDialog()}
    </Box>
  );

  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      {isMobile ? renderMobileView() : renderTableView()}
    </Box>
  );
};

export default OrderList;