import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Box, TextField, Dialog, DialogTitle, DialogContent, DialogActions, useMediaQuery, useTheme } from '@mui/material';

const OrderList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [searchTerm, setSearchTerm] = useState('');
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deliverymen, setDeliverymen] = useState([]);

  const [orders, setOrders] = useState([]); 

  const fetchOrders = async () => {
    const response = await fetch("http://localhost:8000/all_orders/");
    const data = await response.json();
    setOrders(data.orders);
  };

  const fetchDeliverymen = async () => {
    const response = await fetch("http://localhost:8000/all_deliverymen/");
    const data = await response.json();
    setDeliverymen(data.deliverymen);
  };

  useMemo(() => {
    fetchOrders();
    fetchDeliverymen();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter(order =>
      (order.order_id && String(order.order_id).toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.user_name && order.user_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.assigned_deliveryman?.name && order.assigned_deliveryman.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.price && order.price.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.address && order.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.date && order.date.split('T')[0].includes(searchTerm.toLowerCase())) ||  // Modified line to show only date
      (order.pin && order.pin.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [orders, searchTerm]);

  const handleDeleteOrder = async (orderId) => {
    // Send DELETE request to FastAPI to delete the order
    const response = await fetch(`http://localhost:8000/delete_order/${orderId}/`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json'
      },
    });

    if (response.ok) {
      setOrders(orders.filter(order => order.order_id !== orderId));
    } else {
      console.error('Failed to delete order');
    }
  };

  const handleOpenAssignDialog = (order) => {
    setSelectedOrder(order);
    setOpenAssignDialog(true);
  };

  const handleAssignDeliveryman = async (deliveryman) => {
    console.log("Selected Deliveryman User ID:", deliveryman.user_id);

    try {
        const response = await fetch("http://localhost:8000/assign_deliveryman/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                order_id: selectedOrder.order_id, 
                deliveryman_user_id: deliveryman.user_id 
            }) // Use JSON.stringify to serialize the object
        });

        if (response.ok) {
            const data = await response.json();
            // Update the order in your state with the new deliveryman
            setOrders(orders.map(order =>
                order.order_id === selectedOrder.order_id
                    ? { ...order, assigned_deliveryman: deliveryman.user_name, complete: 'Processing' }
                    : order
            ));
            setOpenAssignDialog(false);
            setSelectedOrder(null);
        } else {
            console.error('Failed to assign deliveryman', await response.json());
        }
    } catch (error) {
        console.error('Error in assign deliveryman', error);
    }
};




  const renderAssignDeliverymanDialog = () => (
    <Dialog open={openAssignDialog} onClose={() => setOpenAssignDialog(false)} fullWidth maxWidth="sm">
      <DialogTitle>Assign Deliveryman</DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          Select a deliveryman for Order {selectedOrder?.order_id}
        </Typography>
        {deliverymen.map((deliveryman) => (
          <Button
            key={deliveryman.user_id}
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
        <Paper key={order.order_id} elevation={3} sx={{ margin: 2, padding: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {order.order_id}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {order.date.split('T')[0]}
            </Typography>
          </Box>
          <Typography variant="body1">
            Customer: {order.user_name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Address: {order.address}
          </Typography>
          <Typography variant="body1">
            price: {order.price}
          </Typography>
          {order.assigned_deliveryman && (
            <Typography variant="body2">
              Assigned to: {order.assigned_deliveryman_user_name}
            </Typography>
          )}
          <Typography
            variant="body2"
            sx={{
              color:
                order.complete === '0' ? 'blue' :
                order.complete === '1' ? 'green' : 'gray'
            }}
          >
            Status: {order.complete === '0' ? 'Processing' : 'Delivered'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, marginTop: 1 }}>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              fullWidth
              onClick={() => handleOpenAssignDialog(order)}
            >
              {order.assigned_deliveryman ? 'REASSIGN' : 'ASSIGN'}
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              fullWidth
              onClick={() => handleDeleteOrder(order.order_id)}
            >
              DELETE
            </Button>
          </Box>
        </Paper>
      ))}
      {renderAssignDeliverymanDialog()}
    </Box>
  );

  const renderTableView = () => (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <TextField
        variant="outlined"
        label="Search Orders"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ width: '90%', maxWidth: '1200px', margin: 3, marginBottom: 2 }}
      />
      <TableContainer component={Paper} sx={{ width: '90%', maxWidth: '1200px', margin: isMobile ? 1 : 3 }}>
        <Table size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              <TableCell>Order #</TableCell>
              {!isMobile && <TableCell>Customer</TableCell>}
              <TableCell>price</TableCell>
              {!isMobile && <TableCell>Delivery Man</TableCell>}
              <TableCell>Date</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Pin</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.order_id}>
                <TableCell>{order.order_id}</TableCell>
                {!isMobile && <TableCell>{order.user_name}</TableCell>}
                <TableCell>{order.price}</TableCell>
                {!isMobile && (
                  <TableCell>
                    {order.assigned_deliveryman_user_name ? order.assigned_deliveryman_user_name : 'Not assigned'}
                  </TableCell>
                )}
                <TableCell>{order.date.split('T')[0]}</TableCell>
                <TableCell>{order.address}</TableCell>
                <TableCell>{order.pin}</TableCell> 
                <TableCell
                  sx={{
                    color:
                      order.complete === '0' ? 'blue' :
                      order.complete === '1' ? 'green' : 'gray'
                  }}
                >{order.complete === '0' ? 'Processing' : 'Delivered'}</TableCell> 
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => handleOpenAssignDialog(order)}
                  >
                    {order.assigned_deliveryman ? 'REASSIGN' : 'ASSIGN'}
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleDeleteOrder(order.order_id)}
                  >
                    DELETE
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {renderAssignDeliverymanDialog()}
    </Box>
  );

  return isMobile ? renderMobileView() : renderTableView();
};

export default OrderList;
