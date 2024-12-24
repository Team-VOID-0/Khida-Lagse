// import React, { useState } from 'react';
// import { Card, Image } from 'react-bootstrap';
// import './FoodItem.css';
// import { assets } from '../../assets/ok/assets';

// const FoodItem = ({ id, name, price, description, image }) => {
//   const [itemCount, setItemCount] = useState(0);

//   const handleAddItem = () => {
//     setItemCount(itemCount + 1);
//   };

//   const handleRemoveItem = () => {
//     if (itemCount > 0) {
//       setItemCount(itemCount - 1);
//     }
//   };

//   return (
//     <Card className='food-item shadow-sm mb-4 border-0'>
//       <div className="food-item-image-container">
//         <Card.Img variant="top" className='food-item-image' src={image} alt={name} />
//         {itemCount > 0 ? (
//           <div className="food-item-counter">
//             <button className="counter-btn minus" onClick={handleRemoveItem}><span className="min">-</span></button>
//             <span className='item-count'> {itemCount} </span>
//             <button className="counter-btn plus" onClick={handleAddItem}>+</button>
//           </div>
//         ) : (
//           <button className="add" onClick={handleAddItem}>+</button>
//         )}
//       </div>
//       <Card.Body className="food-item-info">
//         <div className="food-item-name-rating d-flex justify-content-between align-items-center mb-2">
//           <Card.Title as="p" className="mb-0">{name}</Card.Title>
//           <Image src={assets.rating_starts} width="70px" alt="Rating" />
//         </div>
//         <Card.Text className="food-item-desc">
//           {description}
//         </Card.Text>
//         <Card.Text className="food-item-price">
//           ${price}
//         </Card.Text>
//       </Card.Body>
//     </Card>
//   );
// }

// export default FoodItem;



// import React, { useState } from 'react';
// import { Card, Image } from 'react-bootstrap';
// import './FoodItem.css';

// const FoodItem = ({ id, name, price, description, image }) => {
//   const [itemCount, setItemCount] = useState(0);

//   const handleAddItem = () => {
//     setItemCount(itemCount + 1);
//   };

//   const handleRemoveItem = () => {
//     if (itemCount > 0) {
//       setItemCount(itemCount - 1);
//     }
//   };

//   return (
//     <Card className='food-item shadow-sm mb-4 border-0'>
//       <div className="food-item-image-container">
//         <Card.Img variant="top" className='food-item-image' src={image} alt={name} />
//         {itemCount > 0 ? (
//           <div className="food-item-counter">
//             <button className="counter-btn minus" onClick={handleRemoveItem}><span className="min">-</span></button>
//             <span className='item-count'> {itemCount} </span>
//             <button className="counter-btn plus" onClick={handleAddItem}>+</button>
//           </div>
//         ) : (
//           <button className="add" onClick={handleAddItem}>+</button>
//         )}
//       </div>
//       <Card.Body className="food-item-info">
//         <div className="food-item-name-rating d-flex justify-content-between align-items-center mb-2">
//           <Card.Title as="p" className="mb-0">{name}</Card.Title>
//         </div>
//         <Card.Text className="food-item-desc">
//           {description}
//         </Card.Text>
//         <Card.Text className="food-item-price">
//           ৳ {price}
//         </Card.Text>
//       </Card.Body>
//     </Card>
//   );
// }

// export default FoodItem;


import React from 'react';
import { Card } from 'react-bootstrap';
import { useCart } from '../../context/CartContext';
import './FoodItem.css';

const FoodItem = ({ id, name, price, description, image }) => {
  const { cartItems, addToCart, removeFromCart, updateQuantity } = useCart();

  // Find the current item in the cart
  const cartItem = cartItems.find(item => item.id === id);
  const itemCount = cartItem ? cartItem.quantity : 0;

  const handleAddItem = () => {
    addToCart({
      id,
      name,
      price,
      description,
      image
    });
  };

  const handleRemoveItem = () => {
    if (cartItem) {
      if (cartItem.quantity > 1) {
        updateQuantity(id, cartItem.quantity - 1);
      } else {
        removeFromCart(id);
      }
    }
  };

  return (
    <Card className='food-item shadow-sm mb-4 border-0'>
      <div className="food-item-image-container">
        <Card.Img variant="top" className='food-item-image' src={image} alt={name} />
        {itemCount > 0 ? (
          <div className="food-item-counter">
            <button className="counter-btn minus" onClick={handleRemoveItem}><span className="min">-</span></button>
            <span className='item-count'> {itemCount} </span>
            <button className="counter-btn plus" onClick={handleAddItem}>+</button>
          </div>
        ) : (
          <button className="add" onClick={handleAddItem}>+</button>
        )}
      </div>
      <Card.Body className="food-item-info">
        <div className="food-item-name-rating d-flex justify-content-between align-items-center mb-2">
          <Card.Title as="p" className="mb-0">{name}</Card.Title>
        </div>
        <Card.Text className="food-item-desc">
          {description}
        </Card.Text>
        <Card.Text className="food-item-price">
          ৳ {price}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default FoodItem;