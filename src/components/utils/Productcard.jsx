// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";

// const ProductCard = ({
//   product,
//   cart,
//   handleAddToCartHandler,
//   handleUpdateShopHandler,
//   handleIncreaseQuantityHandler,
//   handleDecreaseQuantityHandler,
//   clearFromCartHandler,
// }) => {
//   const [selectedShop, setSelectedShop] = useState(cart[product._id]?.shop || ""); // Default to current selected shop
//   const [finalPrice, setFinalPrice] = useState(cart[product._id]?.FinalPrice || product.FinalPrice);

//   // Update finalPrice when the selectedShop or product changes
//   useEffect(() => {
//     if (selectedShop) {
//       const shopPrice = product.shopPrices?.find((shop) => shop.shopname === selectedShop);
//       setFinalPrice(shopPrice ? shopPrice.price : product.FinalPrice);
//     } else {
//       setFinalPrice(product.FinalPrice);
//     }
//   }, [selectedShop, product]);

//   // Function to handle the shop change
//   const handleShopChange = (e) => {
//     const newShop = e.target.value;
//     setSelectedShop(newShop);
//     handleUpdateShopHandler(product._id, newShop); // Update the selected shop in the cart
//   };

//   const isProductInCart = cart[product._id];
//   const quantity = isProductInCart ? cart[product._id].quantity : 0;

//   return (
//     <motion.div
//       className="product-card"
//       key={product._id}
//       initial={{ opacity: 0, y: 50 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3 }}
//     >
//       <img
//         src={product.thumbnail.replace("http://", "https://")}
//         alt={product.name}
//         className="product-image"
//       />
//       <div className="product-info">
//         <h2 className="product-name">{product.name}</h2>
//         <p className="product-price">
//           <span className="original-price">₹{product.price}</span>
//           <span className="final-price">₹{finalPrice}</span>
//         </p>

//         {isProductInCart ? (
//           <div className="product-actions-shop">
//             <div>
//               {product.shopPrices && product.shopPrices.length > 0 && (
//                 <select
//                   value={selectedShop}
//                   onChange={handleShopChange}
//                   className="product-actions-dropdown"
//                 >
//                   {product.shopPrices.map((shop) => (
//                     <option key={shop._id} value={shop.shopname}>
//                       {shop.shopname} - ₹{shop.price}
//                     </option>
//                   ))}
//                 </select>
//               )}
//             </div>
//             <div>
//               <motion.button
//                 className="quantity-btn decrease-btn"
//                 onClick={() => handleDecreaseQuantityHandler(product)}
//               >
//                 -
//               </motion.button>
//               <span className="quantity">{quantity}</span>
//               <motion.button
//                 className="quantity-btn increase-btn"
//                 onClick={(e) => {
//                   e.stopPropagation(); // Ensure no bubbling
//                   handleIncreaseQuantityHandler(product);
//                 }}
//               >
//                 +
//               </motion.button>

//               <motion.button
//                 className="remove-btn"
//                 onClick={() => clearFromCartHandler(product._id)}
//               >
//                 Remove
//               </motion.button>
//             </div>
//           </div>
//         ) : (
//           <motion.div>
//             {product.shopPrices && product.shopPrices.length > 0 && (
//               <select
//                 defaultValue="change shop"
//                 onChange={(e) =>
//                   handleAddToCartHandler(product, e.target.value)
//                 }
//                 className="product-actions-dropdown"
//               >
//                 <option value="change shop" disabled>
//                   Change shop
//                 </option>
//                 {product.shopPrices.map((shop) => (
//                   <option key={shop._id} value={shop.shopname}>
//                     {shop.shopname} - ₹{shop.price}
//                   </option>
//                 ))}
//               </select>
//             )}
//             <div style={{ marginTop: "10px" }}>
//               <motion.button
//                 className="add-to-cart-btn"
//                 onClick={() =>
//                   handleAddToCartHandler(
//                     product,
//                     product.shopPrices?.[0]?.shopname || ""
//                   )
//                 }
//               >
//                 Add to Cart
//               </motion.button>
//             </div>
//           </motion.div>
//         )}
//       </div>
//     </motion.div>
//   );
// };

// export default ProductCard;


import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const ProductCard = ({ product, cart, setCart }) => {
  const [selectedShop, setSelectedShop] = useState(cart[product._id]?.shop || "");
  const [finalPrice, setFinalPrice] = useState(cart[product._id]?.FinalPrice || product.FinalPrice);

  // Update finalPrice when the selectedShop or product changes
  useEffect(() => {
    if (selectedShop) {
      const shopPrice = product.shopPrices?.find((shop) => shop.shopname === selectedShop);
      setFinalPrice(shopPrice ? shopPrice.price : product.FinalPrice);
    } else {
      setFinalPrice(product.FinalPrice);
    }
  }, [selectedShop, product]);

  const handleAddToCart = (product, selectedShop) => {
    setCart((prevCart) => ({
      ...prevCart,
      [product._id]: {
        ...product,
        quantity: prevCart[product._id]?.quantity + 1 || 1,
        shop: selectedShop,
        FinalPrice: selectedShop
          ? product.shopPrices?.find((shop) => shop.shopname === selectedShop)?.price || product.FinalPrice
          : product.FinalPrice,
      },
    }));
  };

  const handleUpdateShop = (productId, newShop) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      const shopPrice = product.shopPrices?.find((shop) => shop.shopname === newShop);
      if (updatedCart[productId]) {
        updatedCart[productId].shop = newShop;
        updatedCart[productId].FinalPrice = shopPrice ? shopPrice.price : product.FinalPrice;
      }
      return updatedCart;
    });
  };

  const handleIncreaseQuantity = (product) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      if (updatedCart[product._id]) {
        console.log("---------");
        updatedCart[product._id].quantity += 1;
      }
      return updatedCart;
    });
  };

  const handleDecreaseQuantity = (product) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      if (updatedCart[product._id]) {
        updatedCart[product._id].quantity = Math.max(updatedCart[product._id].quantity - 1, 1);
      }
      return updatedCart;
    });
  };

  const clearFromCart = (productId) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      delete updatedCart[productId];
      return updatedCart;
    });
  };

  const isProductInCart = cart[product._id];
  const quantity = isProductInCart ? cart[product._id].quantity : 0;

  return (
    <motion.div
      className="product-card"
      key={product._id}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <img
        src={product.thumbnail.replace("http://", "https://")}
        alt={product.name}
        className="product-image"
      />
      <div className="product-info">
        <h2 className="product-name">{product.name}</h2>
        <p className="product-price">
          <span className="original-price">₹{product.price}</span>
          <span className="final-price">₹{finalPrice}</span>
        </p>
        {isProductInCart ? (
          <div className="product-actions-shop">
            <div>
              {product.shopPrices && product.shopPrices.length > 0 && (
                <select
                  value={selectedShop}
                  onChange={(e) => handleUpdateShop(product._id, e.target.value)}
                  className="product-actions-dropdown"
                >
                  {product.shopPrices.map((shop) => (
                    <option key={shop._id} value={shop.shopname}>
                      {shop.shopname} - ₹{shop.price}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <motion.button
                className="quantity-btn decrease-btn"
                onClick={() => handleDecreaseQuantity(product)}
              >
                -
              </motion.button>
              <span className="quantity">{quantity}</span>
              <motion.button
                className="quantity-btn increase-btn"
                onClick={() => handleIncreaseQuantity(product)}
              >
                +
              </motion.button>
              <motion.button
                className="remove-btn"
                onClick={() => clearFromCart(product._id)}
              >
                Remove
              </motion.button>
            </div>
          </div>
        ) : (
          <motion.div>
            {product.shopPrices && product.shopPrices.length > 0 && (
              <select
                defaultValue="change shop"
                onChange={(e) => handleAddToCart(product, e.target.value)}
                className="product-actions-dropdown"
              >
                <option value="change shop" disabled>
                  Change shop
                </option>
                {product.shopPrices.map((shop) => (
                  <option key={shop._id} value={shop.shopname}>
                    {shop.shopname} - ₹{shop.price}
                  </option>
                ))}
              </select>
            )}
            <div style={{ marginTop: "10px" }}>
              <motion.button
                className="add-to-cart-btn"
                onClick={() =>
                  handleAddToCart(
                    product,
                    product.shopPrices?.[0]?.shopname || ""
                  )
                }
              >
                Add to Cart
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;
