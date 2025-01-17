// import React, { useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import "../../styles/category.css";
// import "../../styles/cartpop.css";
// import { motion, AnimatePresence } from "framer-motion";
// import { makeApi } from "../../api/callApi";
// import Loader from "../../components/loader/loader";

// function CategoryPage() {
//   const { category } = useParams();
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [cart, setCart] = useState({});
//   const [isInitialLoad, setIsInitialLoad] = useState(true);

//   useEffect(() => {
//     if (isInitialLoad) {
//       window.scrollTo(0, 0);
//       setIsInitialLoad(false);
//     }
//   }, [isInitialLoad]);

//   // Fetch category products
//   useEffect(() => {
//     async function fetchCategories() {
//       setLoading(true);
//       try {
//         const response = await makeApi(
//           `/api/get-products-by-service-id/${category}`,
//           "GET"
//         );
//         const sortedProducts = response.data.products.sort(
//           (a, b) => a.FinalPrice - b.FinalPrice
//         );

//         // Add default shop and price for products with shopPrices
//         const updatedProducts = sortedProducts.map((product) => {
//           if (product.shopPrices?.length > 0) {
//             product.defaultShop = product.shopPrices[0].shopname;
//             product.defaultPrice = product.shopPrices[0].price;
//           }
//           return product;
//         });

//         setProducts(updatedProducts);
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchCategories();
//   }, [category]);

//   // Load cart from localStorage on component mount
//   useEffect(() => {
//     const storedCart = JSON.parse(localStorage.getItem("cart")) || {};
//     setCart(storedCart);
//   }, []);

//   // Save cart to localStorage whenever cart changes
//   useEffect(() => {
//     if (Object.keys(cart).length > 0) {
//       localStorage.setItem("cart", JSON.stringify(cart));
//     }
//   }, [cart]);

//   const getTotalCartValue = () => {
//     return Object.values(cart).reduce(
//       (total, item) => total + item.FinalPrice * item.quantity,
//       0
//     );
//   };

//   const clearCart = () => {
//     setCart({});
//     localStorage.removeItem("cart");
//   };

//   const handleAddToCart = (product, selectedShop) => {
//     const shopDetails = product.shopPrices.find(
//       (shop) => shop.shopname === selectedShop
//     );
//     setCart((prevCart) => ({
//       ...prevCart,
//       [product._id]: {
//         ...product,
//         shop: selectedShop,
//         FinalPrice: shopDetails?.price || product.FinalPrice,
//         quantity: product.minorderquantity || 1,
//       },
//     }));
//   };

//   const handleShopChange = (product, selectedShop) => {
//     const shopDetails = product.shopPrices.find(
//       (shop) => shop.shopname === selectedShop
//     );
//     setCart((prevCart) => ({
//       ...prevCart,
//       [product._id]: {
//         ...prevCart[product._id],
//         shop: selectedShop,
//         FinalPrice: shopDetails?.price || product.FinalPrice,
//       },
//     }));
//   };

//   const handleIncreaseQuantity = (product) => {
//     setCart((prevCart) => ({
//       ...prevCart,
//       [product._id]: {
//         ...prevCart[product._id],
//         quantity: prevCart[product._id].quantity + 1,
//       },
//     }));
//   };

//   // const handleDecreaseQuantity = (product) => {
//   //   setCart((prevCart) => {
//   //     const updatedCart = { ...prevCart };
//   //     const existingProduct = prevCart[product._id];
//   //     if (existingProduct.quantity > 1) {
//   //       updatedCart[product._id].quantity -= 1;
//   //     } else {
//   //       delete updatedCart[product._id];
//   //     }
//   //     return updatedCart;
//   //   });
//   // };
//   const handleDecreaseQuantity = (product) => {
//     setCart((prevCart) => {
//       const updatedCart = { ...prevCart };
//       const existingProduct = prevCart[product._id];

//       // Prevent quantity from going below minorderquantity
//       if (existingProduct.quantity > (product.minorderquantity || 1)) {
//         updatedCart[product._id].quantity -= 1;
//       } else {
//         delete updatedCart[product._id];
//       }

//       return updatedCart;
//     });
//   };

//   const clearFromCart = (productId) => {
//     setCart((prevCart) => {
//       const updatedCart = { ...prevCart };
//       delete updatedCart[productId];
//       return updatedCart;
//     });
//   };

//   return (
//     <>
//       {loading ? (
//         <div className="loader-container">
//           <Loader />
//         </div>
//       ) : (
//         <div className="category-page">
//           <h1 className="category-title">
//             {category.charAt(0).toUpperCase() + category.slice(1)}
//           </h1>
//           <div className="product-list">
//             {products.map((product) => (
//               <motion.div
//                 className="product-card"
//                 key={product._id}
//                 initial={{ opacity: 0, y: 50 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <img
//                   src={product.thumbnail.replace("http://", "https://")}
//                   alt={product.name}
//                   className="product-image"
//                 />
//                 <div className="product-info">
//                   <h2 className="product-name">{product.name}</h2>
//                   {product.shopPrices?.length > 0 && (
//                     <div>
//                       Shop name: <b>{cart[product._id]?.shop || product.defaultShop || "N/A"}</b>
//                     </div>
//                   )}

//                   <p className="product-price">
//                     {/* <span className="original-price">₹{product.price}</span> */}
//                     <span className="original-price">₹{cart[product._id]?.price ||
//                       product.defaultPrice ||
//                       product.price}</span>
//                     <span className="final-price">
//                       ₹{cart[product._id]?.FinalPrice ||
//                         product.defaultPrice ||
//                         product.FinalPrice}
//                     </span>
//                   </p>
//                   {product.minorderquantity && (
//                     <p style={{ color: "red" }}>
//                       Min Order Quantity: {product.minorderquantity}
//                     </p>
//                   )}
//                   {product.shopPrices?.length > 0 && (
//                     <div className="shop-selection">
//                       <span style={{ cursor: "pointer", color: "red", fontSize: "13px" }} >
//                         <div>

//                           change shop

//                         </div>
//                       </span>
//                       <select
//                         value={cart[product._id]?.shop || product.defaultShop}
//                         onChange={(e) =>
//                           cart[product._id]
//                             ? handleShopChange(product, e.target.value)
//                             : handleAddToCart(product, e.target.value)
//                         }
//                         className="product-actions-dropdown"
//                       >
//                         {product.shopPrices
//                           .sort((a, b) => a.poistionId - b.poistionId) // Sort based on positionId
//                           .map((shop) => (
//                             <option key={shop._id} value={shop.shopname}>
//                               {shop.shopname} - ₹{shop.FinalPrice}
//                             </option>
//                           ))}

//                       </select>
//                     </div>
//                   )}
//                   {cart[product._id] ? (
//                     <div className="quantity-control">
//                       <motion.button
//                         className="quantity-btn decrease-btn"
//                         onClick={() => handleDecreaseQuantity(product)}
//                       >
//                         -
//                       </motion.button>
//                       <span className="quantity">
//                         {cart[product._id]?.quantity}
//                       </span>
//                       <motion.button
//                         className="quantity-btn increase-btn"
//                         onClick={() => handleIncreaseQuantity(product)}
//                       >
//                         +
//                       </motion.button>
//                       <motion.button
//                         className="remove-btn"
//                         onClick={() => clearFromCart(product._id)}
//                       >
//                         Remove
//                       </motion.button>
//                     </div>
//                   ) : (
//                     <motion.button
//                       className="add-to-cart-btn"
//                       onClick={() =>
//                         handleAddToCart(
//                           product,
//                           product.defaultShop || product.shopPrices[0]?.shopname
//                         )
//                       }
//                     >
//                       Add to Cart
//                     </motion.button>
//                   )}
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//           <AnimatePresence>
//             {Object.keys(cart).length > 0 && (
//               <motion.div
//                 className="mini-cart"
//                 initial={{ opacity: 0, y: 100 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: 100 }}
//                 transition={{ duration: 0.4 }}
//               >
//                 <div style={{ display: "flex", justifyContent: "space-between" }}>
//                   <div className="cart-title-popup">Cart</div>
//                   <motion.button
//                     className="clear-cart-btn"
//                     whileTap={{ scale: 0.9 }}
//                     onClick={clearCart}
//                   >
//                     Clear
//                   </motion.button>
//                 </div>
//                 <ul className="cart-items">
//                   {Object.values(cart).map((item) => (
//                     <motion.li
//                       key={item._id}
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: 10 }}
//                       transition={{ duration: 0.8 }}
//                     >
//                       {item.name} from <b>{item.shop}</b> x {item.quantity} = ₹
//                       {item.FinalPrice * item.quantity}
//                       <motion.button
//                         className="remove-btn-mini"
//                         whileTap={{ scale: 0.9 }}
//                         onClick={() => clearFromCart(item._id)}
//                       >
//                         Remove
//                       </motion.button>
//                     </motion.li>
//                   ))}
//                 </ul>
//                 <div className="cart-footer">
//                   <motion.p
//                     key={getTotalCartValue()}
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.5 }}
//                   >
//                     Total: ₹{getTotalCartValue()}
//                   </motion.p>
//                   <Link to="/cart" style={{ textDecoration: "none" }}>
//                     <button className="buy-now-btn">Buy Now</button>
//                   </Link>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       )}
//     </>
//   );
// }

// export default CategoryPage;

import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../../styles/category.css";
import "../../styles/cartpop.css";
import { motion, AnimatePresence } from "framer-motion";
import { makeApi } from "../../api/callApi";
import Loader from "../../components/loader/loader";

function CategoryPage() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState({});
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (isInitialLoad) {
      window.scrollTo(0, 0);
      setIsInitialLoad(false);
    }
  }, [isInitialLoad]);

  // Fetch category products
  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      try {
        const response = await makeApi(
          `/api/get-products-by-service-id/${category}`,
          "GET"
        );
        const sortedProducts = response.data.products.sort(
          (a, b) => a.FinalPrice - b.FinalPrice
        );

        // Add default shop and price for products with shopPrices
        const updatedProducts = sortedProducts.map((product) => {
          if (product.shopPrices?.length > 0) {
            product.defaultShop = product.shopPrices[0].shopname;
            product.defaultPrice = product.shopPrices[0].price;
            product.defaultFinalPrice = product.shopPrices[0].FinalPrice;
          }
          return product;
        });

        setProducts(updatedProducts);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, [category]);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || {};
    setCart(storedCart);
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    if (Object.keys(cart).length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  const getTotalCartValue = () => {
    return Object.values(cart).reduce(
      (total, item) => total + item.FinalPrice * item.quantity,
      0
    );
  };

  const clearCart = () => {
    setCart({});
    localStorage.removeItem("cart");
  };

  const handleAddToCart = (product, selectedShop) => {
    const shopDetails = product.shopPrices.find(
      (shop) => shop.shopname === selectedShop
    );
    setCart((prevCart) => ({
      ...prevCart,
      [product._id]: {
        ...product,
        shop: selectedShop,
        FinalPrice: shopDetails?.FinalPrice || product.defaultFinalPrice || product.FinalPrice,
        price: shopDetails?.price || product.defaultPrice || product.price,
        quantity: product.minorderquantity || 1,
      },
    }));
  };

  const handleShopChange = (product, selectedShop) => {
    const shopDetails = product.shopPrices.find(
      (shop) => shop.shopname === selectedShop
    );
    setCart((prevCart) => ({
      ...prevCart,
      [product._id]: {
        ...prevCart[product._id],
        shop: selectedShop,
        FinalPrice: shopDetails?.FinalPrice || product.defaultFinalPrice || product.FinalPrice,
        price: shopDetails?.price || product.defaultPrice || product.price,
      },
    }));
  };

  const handleIncreaseQuantity = (product) => {
    setCart((prevCart) => ({
      ...prevCart,
      [product._id]: {
        ...prevCart[product._id],
        quantity: prevCart[product._id].quantity + 1,
      },
    }));
  };

  const handleDecreaseQuantity = (product) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      const existingProduct = prevCart[product._id];

      // Prevent quantity from going below minorderquantity
      if (existingProduct.quantity > (product.minorderquantity || 1)) {
        updatedCart[product._id].quantity -= 1;
      } else {
        delete updatedCart[product._id];
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

  return (
    <>
      {loading ? (
        <div className="loader-container">
          <Loader />
        </div>
      ) : (
        <div className="category-page">
          <h1 className="category-title">
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </h1>
          <div className="product-list">
            {products.map((product) => (
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
                  {product.shopPrices?.length > 0 && (
                    <div>
                      Shop name: <b>{cart[product._id]?.shop || product.defaultShop || "N/A"}</b>
                    </div>
                  )}

                  <p className="product-price">
                    <span className="original-price">
                      ₹{cart[product._id]?.price || product.defaultPrice || product.price}
                    </span>
                    <span className="final-price">
                      ₹{cart[product._id]?.FinalPrice || product.defaultFinalPrice || product.FinalPrice}
                    </span>
                  </p>
                  {product.minorderquantity && (
                    <p style={{ color: "red" }}>
                      Min Order Quantity: {product.minorderquantity}
                    </p>
                  )}
                  {product.shopPrices?.length > 0 && (
                    <div className="shop-selection">
                      <span style={{ cursor: "pointer", color: "red", fontSize: "13px" }}>
                        <div>
                          change shop
                        </div>
                      </span>
                      <select
                        value={cart[product._id]?.shop || product.defaultShop}
                        onChange={(e) =>
                          cart[product._id]
                            ? handleShopChange(product, e.target.value)
                            : handleAddToCart(product, e.target.value)
                        }
                        className="product-actions-dropdown"
                      >
                        {product.shopPrices
                          .sort((a, b) => a.poistionId - b.poistionId) // Sort based on positionId
                          .map((shop) => (
                            <option key={shop._id} value={shop.shopname}>
                              {shop.shopname} - ₹{shop.FinalPrice}
                            </option>
                          ))}
                      </select>
                    </div>
                  )}
                  {cart[product._id] ? (
                    <div className="quantity-control">
                      <motion.button
                        className="quantity-btn decrease-btn"
                        onClick={() => handleDecreaseQuantity(product)}
                      >
                        -
                      </motion.button>
                      <span className="quantity">
                        {cart[product._id]?.quantity}
                      </span>
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
                  ) : (
                    <motion.button
                      className="add-to-cart-btn"
                      onClick={() =>
                        handleAddToCart(
                          product,
                          product.defaultShop || product.shopPrices[0]?.shopname
                        )
                      }
                    >
                      Add to Cart
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
          <AnimatePresence>
            {Object.keys(cart).length > 0 && (
              <motion.div
                className="mini-cart"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                transition={{ duration: 0.4 }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div className="cart-title-popup">Cart</div>
                  <motion.button
                    className="clear-cart-btn"
                    whileTap={{ scale: 0.9 }}
                    onClick={clearCart}
                  >
                    Clear
                  </motion.button>
                </div>
                <ul className="cart-items">
                  {Object.values(cart).map((item) => (
                    <motion.li
                      key={item._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.8 }}
                    >
                      {item.name} from <b>{item.shop}</b> x {item.quantity} = ₹
                      {item.FinalPrice * item.quantity}
                      <motion.button
                        className="remove-btn-mini"
                        whileTap={{ scale: 0.9 }}
                        onClick={() => clearFromCart(item._id)}
                      >
                        Remove
                      </motion.button>
                    </motion.li>
                  ))}
                </ul>
                <div className="cart-footer">
                  <motion.p
                    key={getTotalCartValue()}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    Total: ₹{getTotalCartValue()}
                  </motion.p>
                  <Link to="/cart" style={{ textDecoration: "none" }}>
                    <button className="buy-now-btn">Buy Now</button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}

export default CategoryPage;
