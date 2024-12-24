import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FoodDisplay.css';
import FoodItem from '../FoodItem/FoodItem';

const FoodDisplay = ({ category }) => {
  const [foodList, setFoodList] = useState([]);

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await axios.get('http://localhost:8000/foods/');  
        setFoodList(response.data);
      } catch (error) {
        console.error('Error fetching food items:', error);
      }
    };

    fetchFoodItems();
  }, []);

  return (
    <div className="food-display" id="food-display">
      <h2>Top dishes near you</h2>
      <div className="food-display-list">
        {foodList.map((item, index) => {
          if (category === "All" || category === item.category) {
            return (
              <FoodItem
                key={index}
                id={item.id}
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image_url}
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default FoodDisplay;



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './FoodDisplay.css';
// import FoodItem from '../FoodItem/FoodItem';

// const FoodDisplay = ({ category, searchQuery }) => {
//   const [foodList, setFoodList] = useState([]);
//   const [filteredFoodList, setFilteredFoodList] = useState([]);

//   // Fetch food items
//   useEffect(() => {
//     const fetchFoodItems = async () => {
//       try {
//         const response = await axios.get('http://localhost:8000/foods/');  
//         setFoodList(response.data);
//       } catch (error) {
//         console.error('Error fetching food items:', error);
//       }
//     };

//     fetchFoodItems();
//   }, []);

//   // Filter food items based on category and search query
//   useEffect(() => {
//     let result = foodList;

//     // Filter by category
//     if (category !== "All") {
//       result = result.filter(item => item.category === category);
//     }

//     // Filter by search query
//     if (searchQuery) {
//       const lowercaseQuery = searchQuery.toLowerCase();
//       result = result.filter(item => 
//         item.name.toLowerCase().includes(lowercaseQuery) || 
//         item.description.toLowerCase().includes(lowercaseQuery)
//       );
//     }

//     setFilteredFoodList(result);
//   }, [category, searchQuery, foodList]);

//   return (
//     <div className="food-display" id="food-display">
//       <h2>Top dishes near you</h2>
//       {filteredFoodList.length === 0 ? (
//         <div className="no-results">
//           No food items found matching your search.
//         </div>
//       ) : (
//         <div className="food-display-list">
//           {filteredFoodList.map((item) => (
//             <FoodItem
//               key={item.id}
//               id={item.id}
//               name={item.name}
//               description={item.description}
//               price={item.price}
//               image={item.image_url}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default FoodDisplay;