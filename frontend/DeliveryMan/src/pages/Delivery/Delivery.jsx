import React, { useState, useEffect } from 'react';
import './Delivery.css';
import { jwtDecode } from 'jwt-decode';

const DeliveryTaskApp = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('No token found');
      return;
    }
  
    try {
      const decoded = jwtDecode(token);
      const userName = decoded.sub;
      
      const fetchTasks = async () => {
        try {
          const response = await fetch(`http://localhost:8000/assigned_orders/${userName}`);
          const data = await response.json();
          
          const processedTasks = (Array.isArray(data) ? data : data.orders || [])
            .map(task => ({
              ...task,
              user_name: task.user_name || 'Unknown Customer',
              address: task.address || 'No address provided',
              price: task.price || 0,
              order_id: task.order_id,
              complete: task.complete || 0 // Ensure complete property exists
            }));
            console.log(processedTasks);
            if(processedTasks.complete === 1){
            }
            setTasks(processedTasks);
        } catch (fetchError) {
          console.error('Error fetching tasks:', fetchError);
          setTasks([]); 
        }
      };
  
      fetchTasks();
    } catch (error) {
      console.error('Invalid token format', error);
    }
  }, []);

  const fetchOrderDetails = async (orderId) => {
    setIsLoading(true);
    setSelectedOrderDetails(null);
    
    try {
      const response = await fetch(`http://localhost:8000/order_details/${orderId}`);
      const data = await response.json();
      
      if (data && data.order) {
        setSelectedOrderDetails(data.order);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskSelect = (task) => {
    setSelectedTask(task);
    fetchOrderDetails(task.order_id);
    setPinInput('');
    setPinError(false);
  };

  const handlePinSubmit = async () => {
    if (!selectedOrderDetails) return;

    try {
      const response = await fetch(`http://localhost:8000/cart_checkout/${selectedOrderDetails.order_id}/${pinInput}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      if (response.ok) {
        // Remove the completed task from the list
        setTasks(tasks.filter(task => task.order_id !== selectedOrderDetails.order_id));
        setSelectedTask(null);
        setSelectedOrderDetails(null);
        setPinInput('');
        setPinError(false);
      } else {
        // Handle potential error responses
        const errorData = await response.json();
        console.error('Failed to complete order:', errorData);
        setPinError(true);
      }
    } catch (error) {
      console.error('Error completing order:', error);
      setPinError(true);
    }
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
    setSelectedOrderDetails(null);
    setPinInput('');
    setPinError(false);
  };

  return (
    <div className="delivery-task-app">
      <header className="app-header">
        <div className="header-content">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <h1>Delivery Tasks</h1>
        </div>
      </header>

      <main className="task-container">
        {tasks.length === 0 ? (
          <div className="no-tasks">
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <p>No delivery tasks available</p>
          </div>
        ) : (
          <div className="task-grid">
            {tasks.map(task => (
              <div 
                key={task.order_id} 
                className={`task-card ${task.complete === 1 ? 'completed-task' : ''}`}
                onClick={() => handleTaskSelect(task)}
              >
                <div className="task-card-header">
                  <span className="order-number">Order #{task.order_id}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="3" width="15" height="13"></rect>
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                    <circle cx="5.5" cy="18.5" r="2.5"></circle>
                    <circle cx="18.5" cy="18.5" r="2.5"></circle>
                  </svg>
                </div>
                <h3>{task.user_name}</h3>
                <p className="task-address">{task.address}</p>
                <div className="task-price">${task.price.toFixed(2)}</div>
              </div>
            ))}
          </div>
        )}
      </main>

      {selectedTask && selectedOrderDetails && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order #{selectedOrderDetails.order_id} Details</h2>
              <button className="close-btn" onClick={handleCloseModal}>
                &times;
              </button>
            </div>
            <div className="modal-content">
              <section className="customer-info">
                <h3>Customer Information</h3>
                <p><strong>Name:</strong> {selectedOrderDetails.user_name}</p>
                <p><strong>Address:</strong> {selectedOrderDetails.address}</p>
              </section>

              <section className="order-items">
                <h3>Order Item</h3>
                <ul>
                  <li>
                    {selectedOrderDetails.food_name} 
                    <span>Quantity: {selectedOrderDetails.quantity}</span>
                  </li>
                </ul>
              </section>

              <section className="order-details">
                <h3>Order Details</h3>
                <p><strong>Date:</strong> {new Date(selectedOrderDetails.date).toLocaleString()}</p>
                <p><strong>Total Price:</strong> ${selectedOrderDetails.price.toFixed(2)}</p>
              </section>

              <section className="pin-section">
                <h3>Enter PIN to Complete</h3>
                <input 
                  type="password" 
                  placeholder="Enter PIN" 
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className={pinError ? 'error' : ''}
                  disabled={selectedTask.complete === 1} // Disable input if task is complete
                />
                {pinError && <p className="error-text">Invalid PIN or Order Completion Failed!</p>}
                {selectedTask.complete === 1 && <p className="completed-text">Order Already Completed</p>}
                {selectedTask.complete !== 1 && (
                  <button onClick={handlePinSubmit}>Complete Order</button>
                )}
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryTaskApp;