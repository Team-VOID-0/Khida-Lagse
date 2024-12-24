// import React, { useState } from 'react';
// import { Container, Row, Col, Button, Card } from 'react-bootstrap';
// import { useCart } from '../../context/CartContext';
// import { useNavigate } from 'react-router-dom';

// const OrderPage = () => {
//   const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
//   const navigate = useNavigate();
//   const [isOrderPlacing, setIsOrderPlacing] = useState(false);

//   // Calculate total price
//   const calculateTotal = () => {
//     return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
//   };

//   // Handle place order
//   const handlePlaceOrder = async () => {
//     // Check if user is logged in
//     const token = localStorage.getItem('access_token');
//     // const username = localStorage.getItem('username');
    
//     if (!token) {
//       alert('Please log in to place an order');
//       navigate('/login');
//       return;
//     }

//     // Prompt for address
//     const address = prompt('Please enter your delivery address:');
//     if (!address) {
//       alert('Delivery address is required');
//       return;
//     }

//     setIsOrderPlacing(true);

//     try {
//       // Prepare order data to match backend schema
//       for (const item of cartItems) {
//         const orderData = {
//           user_name: username,
//           food_id: item.id,
//           quantity: item.quantity,
//           address: address
//         };

//         // Send order to backend
//         const response = await fetch('http://localhost:8000/add_to_cart/', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//           },
//           body: JSON.stringify(orderData)
//         });

//         const data = await response.json();

//         if (!response.ok) {
//           throw new Error(data.detail || 'Failed to place order');
//         }
//       }

//       // Clear cart after successful order
//       clearCart();
//       alert('Order placed successfully!');
//       navigate('/');
//     } catch (error) {
//       console.error('Order placement error:', error);
//       alert(error.message || 'An error occurred while placing the order');
//     } finally {
//       setIsOrderPlacing(false);
//     }
//   };

//   if (cartItems.length === 0) {
//     return (
//       <Container className="text-center mt-5">
//         <h2>Your cart is empty</h2>
//         <Button variant="primary" onClick={() => navigate('/')}>
//           Continue Shopping
//         </Button>
//       </Container>
//     );
//   }

//   return (
//     <Container className="mt-4">
//       <h2 className="mb-4">Your Order</h2>
//       <Row>
//         <Col md={8}>
//           {cartItems.map((item) => (
//             <Card key={item.id} className="mb-3">
//               <Card.Body className="d-flex justify-content-between align-items-center">
//                 <div className="d-flex align-items-center">
//                   <img 
//                     src={item.image} 
//                     alt={item.name} 
//                     style={{ width: '80px', height: '80px', objectFit: 'cover', marginRight: '15px' }} 
//                   />
//                   <div>
//                     <Card.Title>{item.name}</Card.Title>
//                     <Card.Text>
//                       Price: ৳{item.price.toFixed(2)}
//                     </Card.Text>
//                     <Card.Text>
//                       {item.description}
//                     </Card.Text>
//                   </div>
//                 </div>
//                 <div className="d-flex align-items-center">
//                   <Button 
//                     variant="outline-secondary" 
//                     size="sm" 
//                     onClick={() => updateQuantity(item.id, item.quantity - 1)}
//                   >
//                     -
//                   </Button>
//                   <span className="mx-2">{item.quantity}</span>
//                   <Button 
//                     variant="outline-secondary" 
//                     size="sm" 
//                     onClick={() => updateQuantity(item.id, item.quantity + 1)}
//                   >
//                     +
//                   </Button>
//                   <Button 
//                     variant="danger" 
//                     size="sm" 
//                     className="ml-2"
//                     onClick={() => removeFromCart(item.id)}
//                   >
//                     Remove
//                   </Button>
//                 </div>
//               </Card.Body>
//             </Card>
//           ))}
//         </Col>
//         <Col md={4}>
//           <Card>
//             <Card.Body>
//               <Card.Title>Order Summary</Card.Title>
//               <Card.Text>
//                 Total Items: {cartItems.reduce((total, item) => total + item.quantity, 0)}
//               </Card.Text>
//               <Card.Text>
//                 Total Price: ৳{calculateTotal()}
//               </Card.Text>
//               <Button 
//                 variant="success" 
//                 onClick={handlePlaceOrder}
//                 disabled={isOrderPlacing}
//                 className="w-100"
//               >
//                 {isOrderPlacing ? 'Placing Order...' : 'Place Order'}
//               </Button>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default OrderPage;


import React, { useState } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Make sure to install this package

const OrderPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();
  const [isOrderPlacing, setIsOrderPlacing] = useState(false);

  // Calculate total price
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  // Handle place order
  const handlePlaceOrder = async () => {
    // Check if user is logged in
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      alert('Please log in to place an order');
      navigate('/');
      return;
    }

    // Decode the JWT to get the username
    let username;
    try {
      const decodedToken = jwtDecode(token);
      username = decodedToken.sub; // Assuming the username is in the 'sub' claim
    } catch (error) {
      console.error('Error decoding token:', error);
      alert('Invalid authentication token');
      return;
    }

    // Prompt for address
    const address = prompt('Please enter your delivery address:');
    if (!address) {
      alert('Delivery address is required');
      return;
    }

    setIsOrderPlacing(true);

    try {
      // Prepare order data to match backend schema
      for (const item of cartItems) {
        const orderData = {
          user_name: username,
          food_id: item.id,
          quantity: item.quantity,
          address: address
        };

        // Send order to backend
        const response = await fetch('http://localhost:8000/add_to_cart/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(orderData)
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || 'Failed to place order');
        }
      }

      // Clear cart after successful order
      clearCart();
      alert('Order placed successfully!');
      navigate('/');
    } catch (error) {
      console.error('Order placement error:', error);
      alert(error.message || 'An error occurred while placing the order');
    } finally {
      setIsOrderPlacing(false);
    }
  };

  // Rest of the component remains the same (previous render logic)
  if (cartItems.length === 0) {
    return (
      <Container className="text-center mt-5">
        <h2>Your cart is empty</h2>
        <Button variant="primary" onClick={() => navigate('/')}>
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Your Order</h2>
      <Row>
        <Col md={8}>
          {cartItems.map((item) => (
            <Card key={item.id} className="mb-3">
              <Card.Body className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    style={{ width: '80px', height: '80px', objectFit: 'cover', marginRight: '15px' }} 
                  />
                  <div>
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text>
                      Price: ৳{item.price.toFixed(2)}
                    </Card.Text>
                    <Card.Text>
                      {item.description}
                    </Card.Text>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <Button 
                    variant="outline-secondary" 
                    size="sm" 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </Button>
                  <span className="mx-2">{item.quantity}</span>
                  <Button 
                    variant="outline-secondary" 
                    size="sm" 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm" 
                    className="ml-2"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <Card.Text>
                Total Items: {cartItems.reduce((total, item) => total + item.quantity, 0)}
              </Card.Text>
              <Card.Text>
                Total Price: ৳{calculateTotal()}
              </Card.Text>
              <Button 
                variant="success" 
                onClick={handlePlaceOrder}
                disabled={isOrderPlacing}
                className="w-100"
              >
                {isOrderPlacing ? 'Placing Order...' : 'Place Order'}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderPage;