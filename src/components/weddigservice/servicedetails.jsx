// import React, { useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import "../../styles/category.css";
// import "../../styles/cartpop.css";
// import { motion, AnimatePresence } from "framer-motion";
// import { makeApi } from "../../api/callApi";
// import Loader from "../../components/loader/loader";

// const SHOP_OPTIONS = ["Jagdish ji", "Rituraj", "Aroma"];

// function CategoryPage() {
//   const { category } = useParams();
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [cart, setCart] = useState({});
//   const [isInitialLoad, setIsInitialLoad] = useState(true);

//   // Scroll to the top on initial load
//   useEffect(() => {
//     if (isInitialLoad) {
//       window.scrollTo(0, 0);
//       setIsInitialLoad(false);
//     }
//   }, [isInitialLoad]);

//   useEffect(() => {
//     async function fetchCategories() {
//       setLoading(true);
//       try {
//         const response = await makeApi(`/api/get-products-by-service-id/${category}`, "GET");
//         const sortedProducts = response.data.products.sort((a, b) => a.FinalPrice - b.FinalPrice);
//         setProducts(sortedProducts);
//       } catch (error) {
//         console.log("Error fetching categories:", error);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchCategories();
//   }, [category]);

//   useEffect(() => {
//     const storedCart = JSON.parse(localStorage.getItem("cart")) || {};
//     setCart(storedCart);
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cart));
//   }, [cart]);

//   const handleAddToCart = (product, selectedShop) => {
//     setCart((prevCart) => {
//       const updatedCart = { ...prevCart };
//       updatedCart[product._id] = {
//         ...product,
//         quantity: product.minorderquantity || 1,
//         shop: selectedShop || "Jagdish ji",
//       };
//       return updatedCart;
//     });
//   };

//   const handleUpdateShop = (productId, newShop) => {
//     setCart((prevCart) => {
//       const updatedCart = { ...prevCart };
//       if (updatedCart[productId]) {
//         updatedCart[productId].shop = newShop;
//       }
//       return updatedCart;
//     });
//   };

//   const handleIncreaseQuantity = (product) => {
//     setCart((prevCart) => {
//       const updatedCart = { ...prevCart };
//       updatedCart[product._id].quantity += 1;
//       return updatedCart;
//     });
//   };

//   const handleDecreaseQuantity = (product) => {
//     setCart((prevCart) => {
//       const updatedCart = { ...prevCart };
//       if (updatedCart[product._id].quantity > 1) {
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
//         <div
//           style={{
//             height: "100vh",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
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
//                   <p className="product-price">
//                     <span className="original-price">₹{product.price}</span>
//                     <span className="final-price">₹{product.FinalPrice}</span>
//                   </p>

//                   {cart[product._id] ? (
//                     <div className="product-actions">
//                       <select
//                         value={cart[product._id].shop}
//                         onChange={(e) =>
//                           handleUpdateShop(product._id, e.target.value)
//                         }
//                       >
//                         {SHOP_OPTIONS.map((shop) => (
//                           <option key={shop} value={shop}>
//                             {shop}
//                           </option>
//                         ))}
//                       </select>
//                       <motion.button
//                         className="quantity-btn decrease-btn"
//                         onClick={() => handleDecreaseQuantity(product)}
//                       >
//                         -
//                       </motion.button>
//                       <span className="quantity">{cart[product._id].quantity}</span>
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
//                     <motion.div>
//                       <select
//                         defaultValue={"Jagdish ji"}
//                         onChange={(e) =>
//                           handleAddToCart(product, e.target.value)
//                         }
//                       >
//                         {SHOP_OPTIONS.map((shop) => (
//                           <option key={shop} value={shop}>
//                             {shop}
//                           </option>
//                         ))}
//                       </select>
//                       <motion.button
//                         className="add-to-cart-btn"
//                         onClick={() => handleAddToCart(product, "Jagdish ji")}
//                       >
//                         Add to Cart
//                       </motion.button>
//                     </motion.div>
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
//                 <ul className="cart-items">
//                   {Object.values(cart).map((item) => (
//                     <li key={item._id}>
//                       {item.name} x {item.quantity} from {item.shop} = ₹
//                       {item.FinalPrice * item.quantity}
//                       <motion.button
//                         className="remove-btn-mini"
//                         onClick={() => clearFromCart(item._id)}
//                       >
//                         Remove
//                       </motion.button>
//                     </li>
//                   ))}
//                 </ul>
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
import { useParams } from "react-router-dom";
import "../../styles/category.css";
import "../../styles/cartpop.css";
import { motion, AnimatePresence } from "framer-motion";
import { makeApi } from "../../api/callApi";
import Loader from "../../components/loader/loader";
import { Link } from "react-router-dom";


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

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      try {
        const response = await makeApi(`/api/get-products-by-service-id/${category}`, "GET");
        const sortedProducts = response.data.products.sort((a, b) => a.FinalPrice - b.FinalPrice);
        setProducts(sortedProducts);
      } catch (error) {
        console.log("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, [category]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || {};
    setCart(storedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleAddToCart = (product, selectedShop) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      const shopPrice = product.shopPrices?.find(shop => shop.shopname === selectedShop);
      const finalPrice = shopPrice ? shopPrice.price : product.FinalPrice;
      updatedCart[product._id] = {
        ...product,
        quantity: product.minorderquantity || 1,
        shop: selectedShop,
        FinalPrice: finalPrice,
      };
      return updatedCart;
    });
  };

  const handleUpdateShop = (productId, newShop) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      const product = products.find(prod => prod._id === productId);
      if (updatedCart[productId] && product) {
        const shopPrice = product.shopPrices?.find(shop => shop.shopname === newShop);
        updatedCart[productId].shop = newShop;
        updatedCart[productId].FinalPrice = shopPrice ? shopPrice.price : product.FinalPrice;
      }
      return updatedCart;
    });
  };

  const handleIncreaseQuantity = (product) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      updatedCart[product._id].quantity += 1;
      return updatedCart;
    });
  };

  const handleDecreaseQuantity = (product) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      if (updatedCart[product._id].quantity > 1) {
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

    const getTotalCartValue = () => {
    return Object.values(cart).reduce(
      (total, item) => total + item.FinalPrice * item.quantity,
      0
    );
  };

  return (
    <>
      {loading ? (
        <div
          style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
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
                  {/* <p className="product-price">
                    <span className="original-price">₹{product.price}</span>
                    <span className="final-price">₹{product.FinalPrice}</span>
                  </p> */}

                  <p className="product-price">
                    <span className="original-price">
                      ₹
                      {cart[product._id]?.shop
                        ? product.shopPrices?.find(
                          (shop) => shop.shopname === cart[product._id]?.shop
                        )?.price || product.price
                        : product.price}
                    </span>
                    <span className="final-price">
                      ₹
                      {cart[product._id]?.shop
                        ? product.shopPrices?.find(
                          (shop) => shop.shopname === cart[product._id]?.shop
                        )?.price || product.FinalPrice
                        : product.FinalPrice}
                    </span>
                  </p>

                  {cart[product._id] ? (
                    <div className="product-actions">
                      {product.shopPrices ? (
                        <select
                          value={cart[product._id].shop}
                          onChange={(e) =>
                            handleUpdateShop(product._id, e.target.value)
                          }
                        >
                          {product.shopPrices.map((shop) => (
                            <option key={shop._id} value={shop.shopname}>
                              {shop.shopname}
                            </option>
                          ))}
                        </select>
                      ) : null}
                      <motion.button
                        className="quantity-btn decrease-btn"
                        onClick={() => handleDecreaseQuantity(product)}
                      >
                        -
                      </motion.button>
                      <span className="quantity">{cart[product._id].quantity}</span>
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
                    <motion.div>
                      {product.shopPrices ? (
                        <select
                          defaultValue={product.shopPrices[0]?.shopname || ""}
                          onChange={(e) =>
                            handleAddToCart(product, e.target.value)
                          }
                        >
                          {product.shopPrices.map((shop) => (
                            <option key={shop._id} value={shop.shopname}>
                              {shop.shopname}
                            </option>
                          ))}
                        </select>
                      ) : null}
                      <motion.button
                        className="add-to-cart-btn"
                        onClick={() =>
                          handleAddToCart(product, product.shopPrices?.[0]?.shopname || "")
                        }
                      >
                        Add to Cart
                      </motion.button>
                    </motion.div>
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
                <ul className="cart-items">
                  {Object.values(cart).map((item) => (
                    <li key={item._id}>
                      {item.name} x {item.quantity} from {item.shop} = ₹
                      {item.FinalPrice * item.quantity}
                      <motion.button
                        className="remove-btn-mini"
                        onClick={() => clearFromCart(item._id)}
                      >
                        Remove
                      </motion.button>
                    </li>
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
