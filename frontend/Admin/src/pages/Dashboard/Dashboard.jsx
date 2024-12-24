// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { Box, Grid, Paper, Typography, useMediaQuery, useTheme,Card,CardContent,CardHeader,Button,Divider,Container 
// } from '@mui/material';
// import { 
//   Person as PersonIcon,
//   Restaurant as RestaurantIcon,
//   ShoppingCart as OrderIcon,
//   MonetizationOn as RevenueIcon,
//   ErrorOutline as AlertIcon
// } from '@mui/icons-material';

// const AdminDashboard = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

//   // Sample dashboard data (unchanged)
//   const [dashboardData, setDashboardData] = useState({
//     totalUsers: 254,
//     totalFoodItems: 42,
//     totalOrders: 1345,
//     totalRevenue: '$45,678.90',
//     recentAlerts: [
      // { id: 1, message: 'Low stock on Chicken Burger', severity: 'warning' },
      // { id: 2, message: 'Payment processing delay', severity: 'error' },
      // { id: 3, message: 'New user registration spike', severity: 'info' }
//     ],
//     salesTrend: [
//       { month: 'Jan', sales: 12000 },
//       { month: 'Feb', sales: 15000 },
//       { month: 'Mar', sales: 18000 },
//       { month: 'Apr', sales: 22000 },
//       { month: 'May', sales: 25000 },
//       { month: 'Jun', sales: 30000 }
//     ]
//   });

//   // StatCard Component (unchanged)
//   const StatCard = ({ icon, title, value, color }) => (
//     <Card 
//       elevation={3} 
//       sx={{ 
//         height: '100%', 
//         display: 'flex', 
//         flexDirection: 'column', 
//         justifyContent: 'space-between' 
//       }}
//     >
//       <CardContent>
//         <Box sx={{ 
//           display: 'flex', 
//           alignItems: 'center', 
//           justifyContent: 'space-between' 
//         }}>
//           {icon}
//           <Typography variant="h5" color={color}>
//             {value}
//           </Typography>
//         </Box>
//         <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
//           {title}
//         </Typography>
//       </CardContent>
//     </Card>
//   );

//   // AlertsSection Component (unchanged)
//   const AlertsSection = () => (
//     <Card elevation={3} sx={{ height: '100%' }}>
//       <CardHeader 
//         title="Recent Alerts" 
//         titleTypographyProps={{ variant: 'h6' }}
//       />
//       <Divider />
//       <CardContent>
//         {dashboardData.recentAlerts.map((alert) => (
//           <Box 
//             key={alert.id} 
//             sx={{ 
//               display: 'flex', 
//               alignItems: 'center', 
//               mb: 1, 
//               p: 1, 
//               borderRadius: 1,
//               backgroundColor: 
//                 alert.severity === 'warning' ? '#fff3e0' :
//                 alert.severity === 'error' ? '#ffebee' :
//                 '#e3f2fd'
//             }}
//           >
//             <AlertIcon 
//               color={
//                 alert.severity === 'warning' ? 'warning' :
//                 alert.severity === 'error' ? 'error' :
//                 'info'
//               } 
//               sx={{ mr: 2 }} 
//             />
//             <Typography variant="body2">{alert.message}</Typography>
//           </Box>
//         ))}
//       </CardContent>
//     </Card>
//   );

//   // SalesTrendChart Component (unchanged)
//   const SalesTrendChart = () => (
//     <Card elevation={3} sx={{ height: '100%' }}>
//       <CardHeader 
//         title="Monthly Sales Trend" 
//         titleTypographyProps={{ variant: 'h6' }}
//       />
//       <Divider />
//       <CardContent>
//         <Box sx={{ 
//           display: 'flex', 
//           justifyContent: 'space-between', 
//           alignItems: 'flex-end', 
//           height: 150 
//         }}>
//           {dashboardData.salesTrend.map((month, index) => (
//             <Box 
//               key={index} 
//               sx={{ 
//                 width: 30, 
//                 backgroundColor: 'primary.main',
//                 height: `${(month.sales / 300)}%`,
//                 borderRadius: 1
//               }}
//               title={`${month.month}: $${month.sales}`}
//             />
//           ))}
//         </Box>
//       </CardContent>
//     </Card>
//   );

//   return (
//     <Container maxWidth="lg"> {/* Added Container to limit width */}
//       <Box sx={{ 
//         flexGrow: 1, 
//         padding: isMobile ? 1 : 3 
//       }}>
//         <Grid container spacing={isMobile ? 1 : 3}>
//           {/* Statistics Cards */}
//           <Grid item xs={12} sm={6} md={3}>
//             <StatCard 
//               icon={<PersonIcon color="primary" sx={{ fontSize: 40 }} />}
//               title="Total Users"
//               value={dashboardData.totalUsers}
//               color="primary.main"
//             />
//           </Grid>
//           <Grid item xs={12} sm={6} md={3}>
//             <StatCard 
//               icon={<RestaurantIcon color="secondary" sx={{ fontSize: 40 }} />}
//               title="Food Items"
//               value={dashboardData.totalFoodItems}
//               color="secondary.main"
//             />
//           </Grid>
//           <Grid item xs={12} sm={6} md={3}>
//             <StatCard 
//               icon={<OrderIcon color="success" sx={{ fontSize: 40 }} />}
//               title="Total Orders"
//               value={dashboardData.totalOrders}
//               color="success.main"
//             />
//           </Grid>
//           <Grid item xs={12} sm={6} md={3}>
//             <StatCard 
//               icon={<RevenueIcon color="info" sx={{ fontSize: 40 }} />}
//               title="Total Revenue"
//               value={dashboardData.totalRevenue}
//               color="info.main"
//             />
//           </Grid>

//           {/* Alerts Section */}
//           <Grid item xs={12} md={8}>
//             <SalesTrendChart />
//           </Grid>
//           <Grid item xs={12} md={4}>
//             <AlertsSection />
//           </Grid>

//           {/* Quick Action Buttons */}
//           <Grid item xs={12}>
//             <Card elevation={3}>
//               <CardContent>
//                 <Typography variant="h6" gutterBottom>
//                   Quick Actions
//                 </Typography>
//                 <Box sx={{ 
//                   display: 'flex', 
//                   flexWrap: 'wrap', 
//                   gap: 2, 
//                   justifyContent: 'center' 
//                 }}>
//                   <Link to='/user'>
//                       <Button
//                         variant="contained"
//                         color="primary"
//                         sx={{ minWidth: 150 }}
//                       >
//                         Manage Users
//                       </Button>
//                   </Link>
//                   <Link to='/list'>
//                       <Button
//                         variant="contained"
//                         color="secondary"
//                         sx={{ minWidth: 150 }}
//                       >
//                         Update Menu
//                       </Button>
//                   </Link>
//                   <Link to='/orders'>
//                       <Button
//                         variant="contained"
//                         color="success"
//                         sx={{ minWidth: 150 }}
//                       >
//                         View Orders
//                       </Button>
//                   </Link>
//                   <Button 
//                     variant="contained" 
//                     color="info"
//                     sx={{ minWidth: 150 }}
//                   >
//                     Generate Report
//                   </Button>
//                 </Box>
//               </CardContent>
//             </Card>
//           </Grid>
//         </Grid>
//       </Box>
//     </Container>
//   );
// };

// export default AdminDashboard;



// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { Box, Grid, Paper, Typography, useMediaQuery, useTheme, Card, CardContent, CardHeader, Button, Divider, Container } from '@mui/material';
// import {
//   Person as PersonIcon,
//   Restaurant as RestaurantIcon,
//   ShoppingCart as OrderIcon,
//   MonetizationOn as RevenueIcon,
//   ErrorOutline as AlertIcon
// } from '@mui/icons-material';

// const AdminDashboard = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

//   // State for dashboard data
//   const [dashboardData, setDashboardData] = useState({
//     totalUsers: 0,
//     totalFoodItems: 0,
//     totalOrders: 0,
//     totalRevenue: 0, // Changed from string to number
//     recentAlerts: [],
//     salesTrend: [],
//   });

//   // Fetch statistics from backend
//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const response = await fetch('http://localhost:8000/count_statistics'); // Replace with your backend endpoint
//         const data = await response.json();
//         setDashboardData({
//           ...dashboardData,
//           totalUsers: data.total_users,
//           totalFoodItems: data.total_food_items,
//           totalOrders: data.total_orders,
//           totalRevenue: data.total_price,
//           recentAlerts: data.recent_alerts || [],
//           salesTrend: data.sales_trend || [],
//         });
//       } catch (error) {
//         console.error('Error fetching dashboard data:', error);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   // StatCard Component
//   const StatCard = ({ icon, title, value, color }) => (
//     <Card
//       elevation={3}
//       sx={{
//         height: '100%',
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'space-between',
//       }}
//     >
//       <CardContent>
//         <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//           {icon}
//           <Typography variant="h5" color={color}>
//             {value}
//           </Typography>
//         </Box>
//         <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
//           {title}
//         </Typography>
//       </CardContent>
//     </Card>
//   );

//   return (
//     <Container maxWidth="lg">
//       <Box sx={{ flexGrow: 1, padding: isMobile ? 1 : 3 }}>
//         <Grid container spacing={isMobile ? 1 : 3}>
//           {/* Statistics Cards */}
//           <Grid item xs={12} sm={6} md={3}>
//             <StatCard
//               icon={<PersonIcon color="primary" sx={{ fontSize: 40 }} />}
//               title="Total Users"
//               value={dashboardData.totalUsers}
//               color="primary.main"
//             />
//           </Grid>
//           <Grid item xs={12} sm={6} md={3}>
//             <StatCard
//               icon={<RestaurantIcon color="secondary" sx={{ fontSize: 40 }} />}
//               title="Food Items"
//               value={dashboardData.totalFoodItems}
//               color="secondary.main"
//             />
//           </Grid>
//           <Grid item xs={12} sm={6} md={3}>
//             <StatCard
//               icon={<OrderIcon color="success" sx={{ fontSize: 40 }} />}
//               title="Total Orders"
//               value={dashboardData.totalOrders}
//               color="success.main"
//             />
//           </Grid>
//           <Grid item xs={12} sm={6} md={3}>
//             <StatCard
//               icon={<RevenueIcon color="info" sx={{ fontSize: 40 }} />}
//               title="Total Revenue"
//               value={`$${dashboardData.totalRevenue}`}
//               color="info.main"
//             />
//           </Grid>

//           {/* Additional Sections */}
//           <Grid item xs={12} md={8}>
//             {/* Placeholder for a future chart or trend component */}
//             <Typography variant="h6" gutterBottom>
//               Monthly Sales Trend (To be implemented)
//             </Typography>
//           </Grid>
//           <Grid item xs={12} md={4}>
//             {/* Placeholder for Alerts Section */}
//             <Typography variant="h6" gutterBottom>
//               Recent Alerts (To be implemented)
//             </Typography>
//           </Grid>
//         </Grid>
//       </Box>
//     </Container>
//   );
// };

// export default AdminDashboard;



import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  CardHeader,
  Button,
  Divider,
  Container,
  Alert,
  AlertTitle,
} from '@mui/material';
import {
  Person as PersonIcon,
  Restaurant as RestaurantIcon,
  ShoppingCart as OrderIcon,
  MonetizationOn as RevenueIcon,
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

// Register chart components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const AdminDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // State for dashboard data
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalFoodItems: 0,
    totalOrders: 0,
    totalRevenue: 0,
    salesTrend: [10, 20, 15, 30, 25, 35], // Sample sales data for graph
    recentAlerts: [
      { id: 1, message: 'Low stock on Chicken Burger', severity: 'warning' },
      { id: 2, message: 'Payment processing delay', severity: 'error' },
      { id: 3, message: 'New user registration spike', severity: 'info' },
    ],
  });

  // Fetch statistics from backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://localhost:8000/count_statistics'); // Replace with your backend endpoint
        const data = await response.json();
        setDashboardData((prevState) => ({
          ...prevState,
          totalUsers: data.total_users,
          totalFoodItems: data.total_food_items,
          totalOrders: data.total_orders,
          totalRevenue: data.total_price,
          salesTrend: data.sales_trend || prevState.salesTrend,
        }));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  // Graph Data
  const graphData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], // Replace with dynamic labels if needed
    datasets: [
      {
        label: 'Sales Trend',
        data: dashboardData.salesTrend,
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  // StatCard Component
  const StatCard = ({ icon, title, value, color }) => (
    <Card
      elevation={3}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {icon}
          <Typography variant="h5" color={color}>
            {value}
          </Typography>
        </Box>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
          {title}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ flexGrow: 1, padding: isMobile ? 1 : 3 }}>
        <Grid container spacing={isMobile ? 1 : 3}>
          {/* Statistics Cards */}
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<PersonIcon color="primary" sx={{ fontSize: 40 }} />}
              title="Total Users"
              value={dashboardData.totalUsers}
              color="primary.main"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<RestaurantIcon color="secondary" sx={{ fontSize: 40 }} />}
              title="Food Items"
              value={dashboardData.totalFoodItems}
              color="secondary.main"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<OrderIcon color="success" sx={{ fontSize: 40 }} />}
              title="Total Orders"
              value={dashboardData.totalOrders}
              color="success.main"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<RevenueIcon color="info" sx={{ fontSize: 40 }} />}
              title="Total Revenue"
              value={`৳${dashboardData.totalRevenue}`}
              color="info.main"
            />
          </Grid>

          {/* Graph Section */}
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6" gutterBottom>
                Monthly Sales Trend
              </Typography>
              <Line data={graphData} />
            </Paper>
          </Grid>

          {/* Alerts Section */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6" gutterBottom>
                Recent Alerts
              </Typography>
              {dashboardData.recentAlerts.map((alert) => (
                <Alert key={alert.id} severity={alert.severity} sx={{ mb: 1 }}>
                  <AlertTitle>{alert.severity.toUpperCase()}</AlertTitle>
                  {alert.message}
                </Alert>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AdminDashboard;
