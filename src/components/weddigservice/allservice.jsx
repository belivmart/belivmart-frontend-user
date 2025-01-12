
// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import "../../styles/allservice.css";
// import "../../styles/cartpop.css";
// import { motion, AnimatePresence } from "framer-motion";
// import { makeApi } from "../../api/callApi";
// import Loader from "../../components/loader/loader";

// function AllServicesPage() {
//   const [categories, setCategories] = useState([]);
//   const [filteredCategories, setFilteredCategories] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isSearchingProducts, setIsSearchingProducts] = useState(false);
//   const [cart, setCart] = useState({});
//   const [isInitialLoad, setIsInitialLoad] = useState(true);

//   useEffect(() => {
//     async function fetchCategories() {
//       setLoading(true);
//       try {
//         const response = await makeApi("/api/get-all-categories", "GET");
//         const sortedCategories = response.data.sort((a, b) => a.poistionId - b.poistionId);
//         setCategories(sortedCategories);
//         setFilteredCategories(sortedCategories);
//       } catch (error) {
//         console.log("Error fetching categories:", error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchCategories();
//   }, []);

//   useEffect(() => {
//     if (!searchQuery.trim()) {
//       // Reset to show all categories when the input is empty
//       setProducts([]);
//       setFilteredCategories(categories);
//       setIsSearchingProducts(false);
//       return;
//     }
  
//     async function fetchProducts() {
//       setLoading(true);
//       try {
//         const response = await makeApi(`/api/products/search?word=${searchQuery}`, "GET");
//         setProducts(response.data.products);
//         setIsSearchingProducts(true);
//       } catch (error) {
//         console.log("Error fetching products:", error);
//       } finally {
//         setLoading(false);
//       }
//     }
  
//     fetchProducts();
//   }, [searchQuery, categories]);
  

//   const clearCart = () => {
//     setCart({});
//     localStorage.removeItem("cart");
//   };

//   useEffect(() => {
//     const storedCart = JSON.parse(localStorage.getItem("cart")) || {};
//     setCart(storedCart);
//     setIsInitialLoad(false);
//   }, []);

//   useEffect(() => {
//     if (!isInitialLoad) {
//       localStorage.setItem("cart", JSON.stringify(cart));
//     }
//   }, [cart, isInitialLoad]);

//   const handleAddToCart = (product) => {
//     setCart((prevCart) => {
//       const updatedCart = { ...prevCart };
//       const existingProduct = prevCart[product._id];

//       if (!existingProduct) {
//         updatedCart[product._id] = {
//           ...product,
//           quantity: product.minorderquantity || 1,
//         };
//       }

//       return updatedCart;
//     });
//   };

//   const handleShowAllCategories = () => {
//     setSearchQuery("");
//     setIsSearchingProducts(false);
//   };

//   const getTotalCartValue = () => {
//     return Object.values(cart).reduce(
//       (total, item) => total + item.FinalPrice * item.quantity,
//       0
//     );
//   };

//   const clearFromCart = (productId) => {
//     setCart((prevCart) => {
//       const updatedCart = { ...prevCart };
//       delete updatedCart[productId];
//       localStorage.setItem("cart", JSON.stringify(updatedCart));
//       return updatedCart;
//     });
//   };


  

//   return (
//     <div className="all-services-page">
//       <div className="search-container">
//         <input
//           type="text"
//           placeholder="Search for services or products..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
//           className="search-input"
//         />
//         {loading && (
//           <div style={{ marginTop: "10px", display: "flex", justifyContent: "center" }}>
//             <Loader />
//           </div>
//         )}
//       </div>

//       {isSearchingProducts ? (
//         products.length > 0 ? (
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
//                   <motion.button
//                     className="add-to-cart-btn"
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => handleAddToCart(product)}
//                   >
//                     Add to Cart
//                   </motion.button>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         ) : (
//           <div
//             className="no-products-container"
//             style={{
//               textAlign: "center",
//               marginTop: "20px",
//               padding: "20px",
//               backgroundColor: "#f9f9f9",
//               borderRadius: "8px",
//               boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//             }}
//           >
//             <h2>No products found for "{searchQuery}".</h2>
//             <button
//               onClick={handleShowAllCategories}
//               style={{
//                 backgroundColor: "#007bff",
//                 color: "#fff",
//                 padding: "10px 20px",
//                 border: "none",
//                 borderRadius: "5px",
//                 cursor: "pointer",
//                 fontSize: "16px",
//                 marginTop: "10px",
//               }}
//             >
//               Show All Categories
//             </button>
//           </div>
//         )
//       ) : (
//         <div className="services-container">
//           {filteredCategories.map((service) => (
//             <motion.div
//               className="service-card"
//               key={service._id}
//               initial={{ scale: 0.8, y: 100 }}
//               animate={{ scale: 1, y: 0 }}
//               transition={{ duration: 0.4 }}
//             >
//               <Link
//                 to={`/category/${service.name.toLowerCase()}`}
//                 className="service-link"
//               >
//                 <img
//                   src={service.image.replace("http://", "https://")}
//                   alt={service.name}
//                   className="service-image"
//                 />
//                 <div className="service-details">
//                   <h2 className="service-title">{service.name}</h2>
//                 </div>
//               </Link>
//             </motion.div>
//           ))}
//         </div>
//       )}

//       {/* Mini Cart Popup */}
//       <AnimatePresence>
//         {Object.keys(cart).length > 0 && (
//           <motion.div
//             className="mini-cart"
//             initial={{ opacity: 0, y: 100 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 100 }}
//             transition={{ duration: 0.4 }}
//           >
//             <div style={{ display: "flex", justifyContent: "space-between" }}>
//               <div className="cart-title-popup">Cart</div>
//               <motion.button
//                 className="clear-cart-btn"
//                 whileTap={{ scale: 0.9 }}
//                 onClick={clearCart}
//               >
//                 Clear
//               </motion.button>
//             </div>
//             <ul className="cart-items">
//               {Object.values(cart).map((item) => (
//                 <motion.li
//                   key={item._id}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: 10 }}
//                   transition={{ duration: 0.8 }}
//                 >
//                   {item.name} x {item.quantity} = ₹{item.FinalPrice * item.quantity}
//                   <motion.button
//                     className="remove-btn-mini"
//                     whileTap={{ scale: 0.9 }}
//                     onClick={() => clearFromCart(item._id)}
//                   >
//                     Remove
//                   </motion.button>
//                 </motion.li>
//               ))}
//             </ul>
//             <div className="cart-footer">
//               <motion.p
//                 key={getTotalCartValue()}
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5 }}
//               >
//                 Total: ₹{getTotalCartValue()}
//               </motion.p>
//               <Link to="/cart" style={{ textDecoration: "none" }}>
//                 <button className="buy-now-btn">Buy Now</button>
//               </Link>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// export default AllServicesPage;

// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import "../../styles/allservice.css";
// import "../../styles/cartpop.css";
// import { motion, AnimatePresence } from "framer-motion";
// import { makeApi } from "../../api/callApi";
// import Loader from "../../components/loader/loader";
// import MiniCart from "../popup/Minicart";

// function AllServicesPage() {
//   const [categories, setCategories] = useState([]);
//   const [filteredCategories, setFilteredCategories] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isSearchingProducts, setIsSearchingProducts] = useState(false);
//   const [cart, setCart] = useState({});
//   const [isInitialLoad, setIsInitialLoad] = useState(true);

//   useEffect(() => {
//     async function fetchCategories() {
//       setLoading(true);
//       try {
//         const response = await makeApi("/api/get-all-categories", "GET");
//         const sortedCategories = response.data.sort(
//           (a, b) => a.poistionId - b.poistionId
//         );
//         setCategories(sortedCategories);
//         setFilteredCategories(sortedCategories);
//       } catch (error) {
//         console.log("Error fetching categories:", error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchCategories();
//   }, []);

//   useEffect(() => {
//     if (!searchQuery.trim()) {
//       // Reset to show all categories when the input is empty
//       setProducts([]);
//       setFilteredCategories(categories);
//       setIsSearchingProducts(false);
//       return;
//     }

//     async function fetchProducts() {
//       setLoading(true);
//       try {
//         const response = await makeApi(`/api/products/search?word=${searchQuery}`, "GET");
//         setProducts(response.data.products);
//         setIsSearchingProducts(true);
//       } catch (error) {
//         console.log("Error fetching products:", error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchProducts();
//   }, [searchQuery, categories]);

//   const clearCart = () => {
//     setCart({});
//     localStorage.removeItem("cart");
//   };

//   useEffect(() => {
//     const storedCart = JSON.parse(localStorage.getItem("cart")) || {};
//     setCart(storedCart);
//     setIsInitialLoad(false);
//   }, []);

//   useEffect(() => {
//     if (!isInitialLoad) {
//       localStorage.setItem("cart", JSON.stringify(cart));
//     }
//   }, [cart, isInitialLoad]);

//   const handleAddToCart = (product) => {
//     setCart((prevCart) => {
//       const updatedCart = { ...prevCart };
//       const existingProduct = prevCart[product._id];

//       if (!existingProduct) {
//         updatedCart[product._id] = {
//           ...product,
//           quantity: product.minorderquantity || 1,
//         };
//       }

//       return updatedCart;
//     });
//   };

//   const handleShowAllCategories = () => {
//     setSearchQuery("");
//     setIsSearchingProducts(false);
//   };

//   const getTotalCartValue = () => {
//     return Object.values(cart).reduce(
//       (total, item) => total + item.FinalPrice * item.quantity,
//       0
//     );
//   };

//   const clearFromCart = (productId) => {
//     setCart((prevCart) => {
//       const updatedCart = { ...prevCart };
//       delete updatedCart[productId];
//       localStorage.setItem("cart", JSON.stringify(updatedCart));
//       return updatedCart;
//     });
//   };

//   return (
//     <div className="all-services-page">
//       <div className="search-container">
//         <input
//           type="text"
//           placeholder="Search for services or products..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
//           className="search-input"
//         />
//         {loading && (
//           <div style={{ marginTop: "10px", display: "flex", justifyContent: "center" }}>
//             <Loader />
//           </div>
//         )}
//       </div>

//       {isSearchingProducts ? (
//         products.length > 0 ? (
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
//                   <motion.button
//                     className="add-to-cart-btn"
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => handleAddToCart(product)}
//                   >
//                     Add to Cart
//                   </motion.button>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         ) : (
//           <div
//             className="no-products-container"
//             style={{
//               textAlign: "center",
//               marginTop: "20px",
//               padding: "20px",
//               backgroundColor: "#f9f9f9",
//               borderRadius: "8px",
//               boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//             }}
//           >
//             <h2>No products found for "{searchQuery}".</h2>
//             <button
//               onClick={handleShowAllCategories}
//               style={{
//                 backgroundColor: "#007bff",
//                 color: "#fff",
//                 padding: "10px 20px",
//                 border: "none",
//                 borderRadius: "5px",
//                 cursor: "pointer",
//                 fontSize: "16px",
//                 marginTop: "10px",
//               }}
//             >
//               Show All Categories
//             </button>
//           </div>
//         )
//       ) : (
//         <div className="services-container">
//           {filteredCategories.map((service) => (
//             <motion.div
//               className="service-card"
//               key={service._id}
//               initial={{ scale: 0.8, y: 100 }}
//               animate={{ scale: 1, y: 0 }}
//               transition={{ duration: 0.4 }}
//             >
//               <Link to={`/category/${service.name.toLowerCase()}`} className="service-link">
//                 <img
//                   src={service.image.replace("http://", "https://")}
//                   alt={service.name}
//                   className="service-image"
//                 />
//                 <div className="service-details">
//                   <h2 className="service-title">{service.name}</h2>
//                 </div>
//               </Link>
//             </motion.div>
//           ))}
//         </div>
//       )}

//       {/* Mini Cart Popup */}
//       <MiniCart 
//         cart={cart}
//         clearCart={clearCart}
//         clearFromCart={clearFromCart}
//         getTotalCartValue={getTotalCartValue}
//       />
//     </div>
//   );
// }

// export default AllServicesPage;

// AllServicesPage.js

// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import "../../styles/allservice.css";
// import "../../styles/cartpop.css";
// import { motion } from "framer-motion";
// import { makeApi } from "../../api/callApi";
// import Loader from "../../components/loader/loader";
// import MiniCart from "../popup/Minicart";
// import { handleAddToCart, handleIncreaseQuantity, handleDecreaseQuantity, clearFromCart, clearCart, getTotalCartValue } from "../utils/Cartutils"; // Import utility functions

// function AllServicesPage() {
//   const [categories, setCategories] = useState([]);
//   const [filteredCategories, setFilteredCategories] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isSearchingProducts, setIsSearchingProducts] = useState(false);
//   const [cart, setCart] = useState({});
//   const [isInitialLoad, setIsInitialLoad] = useState(true);

//   useEffect(() => {
//     async function fetchCategories() {
//       setLoading(true);
//       try {
//         const response = await makeApi("/api/get-all-categories", "GET");
//         const sortedCategories = response.data.sort((a, b) => a.poistionId - b.poistionId);
//         setCategories(sortedCategories);
//         setFilteredCategories(sortedCategories);
//       } catch (error) {
//         console.log("Error fetching categories:", error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchCategories();
//   }, []);

//   useEffect(() => {
//     if (!searchQuery.trim()) {
//       setProducts([]);
//       setFilteredCategories(categories);
//       setIsSearchingProducts(false);
//       return;
//     }

//     async function fetchProducts() {
//       setLoading(true);
//       try {
//         const response = await makeApi(`/api/products/search?word=${searchQuery}`, "GET");
//         setProducts(response.data.products);
//         setIsSearchingProducts(true);
//       } catch (error) {
//         console.log("Error fetching products:", error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchProducts();
//   }, [searchQuery, categories]);

//   useEffect(() => {
//     const storedCart = JSON.parse(localStorage.getItem("cart")) || {};
//     setCart(storedCart);
//   }, []);

//   useEffect(() => {
//     if (!isInitialLoad) {
//       localStorage.setItem("cart", JSON.stringify(cart));
//     }
//   }, [cart, isInitialLoad]);

//   const handleAddToCartHandler = (product) => {
//     setCart((prevCart) => handleAddToCart(prevCart, product));
//   };

//   const handleIncreaseQuantityHandler = (product) => {
//     setCart((prevCart) => handleIncreaseQuantity(prevCart, product));
//   };

//   const handleDecreaseQuantityHandler = (product) => {
//     setCart((prevCart) => handleDecreaseQuantity(prevCart, product));
//   };

//   const clearFromCartHandler = (productId) => {
//     setCart((prevCart) => clearFromCart(prevCart, productId));
//   };

//   const clearCartHandler = () => {
//     setCart(clearCart());
//     localStorage.removeItem("cart");
//   };

//   return (
//     <div className="all-services-page">
//       <div className="search-container">
//         <input
//           type="text"
//           placeholder="Search for services or products..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
//           className="search-input"
//         />
//         {loading && (
//           <div style={{ marginTop: "10px", display: "flex", justifyContent: "center" }}>
//             <Loader />
//           </div>
//         )}
//       </div>

//       {isSearchingProducts ? (
//         products.length > 0 ? (
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
//                   <motion.button
//                     className="add-to-cart-btn"
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => handleAddToCartHandler(product)}
//                   >
//                     Add to Cart
//                   </motion.button>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         ) : (
//           <div className="no-products-container">
//             <h2>No products found for "{searchQuery}".</h2>
//             <button
//               onClick={() => {
//                 setSearchQuery("");
//                 setIsSearchingProducts(false);
//               }}
//             >
//               Show All Categories
//             </button>
//           </div>
//         )
//       ) : (
//         <div className="services-container">
//           {filteredCategories.map((service) => (
//             <motion.div
//               className="service-card"
//               key={service._id}
//               initial={{ scale: 0.8, y: 100 }}
//               animate={{ scale: 1, y: 0 }}
//               transition={{ duration: 0.4 }}
//             >
//               <Link to={`/category/${service.name.toLowerCase()}`} className="service-link">
//                 <img
//                   src={service.image.replace("http://", "https://")}
//                   alt={service.name}
//                   className="service-image"
//                 />
//                 <div className="service-details">
//                   <h2 className="service-title">{service.name}</h2>
//                 </div>
//               </Link>
//             </motion.div>
//           ))}
//         </div>
//       )}

//       {/* Mini Cart Popup */}
//       <MiniCart
//         cart={cart}
//         clearCart={clearCartHandler}
//         clearFromCart={clearFromCartHandler}
//         getTotalCartValue={() => getTotalCartValue(cart)}
//       />
//     </div>
//   );
// }

// export default AllServicesPage;


// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import "../../styles/allservice.css";
// import "../../styles/cartpop.css";
// import { motion } from "framer-motion";
// import { makeApi } from "../../api/callApi";
// import Loader from "../../components/loader/loader";
// import MiniCart from "../popup/Minicart";
// import { handleAddToCart, handleIncreaseQuantity, handleDecreaseQuantity, clearFromCart, clearCart, getTotalCartValue,handleUpdateShop } from "../utils/Cartutils"; // Import utility functions
// import ProductCard from "../utils/Productcard"; 


// function AllServicesPage() {
//   const [categories, setCategories] = useState([]);
//   const [filteredCategories, setFilteredCategories] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isSearchingProducts, setIsSearchingProducts] = useState(false);
//   const [cart, setCart] = useState({});
//   const [isInitialLoad, setIsInitialLoad] = useState(true);

//   useEffect(() => {
//     async function fetchCategories() {
//       setLoading(true);
//       try {
//         const response = await makeApi("/api/get-all-categories", "GET");
//         const sortedCategories = response.data.sort((a, b) => a.poistionId - b.poistionId);
//         setCategories(sortedCategories);
//         setFilteredCategories(sortedCategories);
//       } catch (error) {
//         console.log("Error fetching categories:", error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchCategories();
//   }, []);

//   useEffect(() => {
//     if (!searchQuery.trim()) {
//       setProducts([]);
//       setFilteredCategories(categories);
//       setIsSearchingProducts(false);
//       return;
//     }

//     async function fetchProducts() {
//       setLoading(true);
//       try {
//         const response = await makeApi(`/api/products/search?word=${searchQuery}`, "GET");
//         setProducts(response.data.products);
//         setIsSearchingProducts(true);
//       } catch (error) {
//         console.log("Error fetching products:", error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchProducts();
//   }, [searchQuery, categories]);

  
//     const handleUpdateShopHandler = (productId, newShop) => {
//       setCart((prevCart) => handleUpdateShop(prevCart, productId, newShop, products));
//     };

//   useEffect(() => {
//     const storedCart = JSON.parse(localStorage.getItem("cart")) || {};
//     setCart(storedCart);
//   }, []);

//   useEffect(() => {
//     if (!isInitialLoad) {
//       localStorage.setItem("cart", JSON.stringify(cart));
//     }
//   }, [cart, isInitialLoad]);

//   const handleAddToCartHandler = (product) => {
//     setCart((prevCart) => handleAddToCart(prevCart, product));
//   };

//   const handleIncreaseQuantityHandler = (product) => {
//     setCart((prevCart) => handleIncreaseQuantity(prevCart, product));
//   };

//   const handleDecreaseQuantityHandler = (product) => {
//     setCart((prevCart) => handleDecreaseQuantity(prevCart, product));
//   };

//   const clearFromCartHandler = (productId) => {
//     setCart((prevCart) => clearFromCart(prevCart, productId));
//   };

//   const clearCartHandler = () => {
//     setCart(clearCart());
//     localStorage.removeItem("cart");
//   };

//   return (
//     <div className="all-services-page">
//       <div className="search-container">
//         <input
//           type="text"
//           placeholder="Search for services or products..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
//           className="search-input"
//         />
//         {loading && (
//           <div style={{ marginTop: "10px", display: "flex", justifyContent: "center" }}>
//             <Loader />
//           </div>
//         )}
//       </div>

//       {isSearchingProducts ? (
//         products.length > 0 ? (
//           <div className="product-list">
//             {products.map((product) => (
//               <ProductCard
//               key={product._id}
//               product={product}
//               cart={cart}
//               handleAddToCartHandler={handleAddToCartHandler}
//               handleUpdateShopHandler={handleUpdateShopHandler}
//               handleIncreaseQuantityHandler={handleIncreaseQuantityHandler}
//               handleDecreaseQuantityHandler={handleDecreaseQuantityHandler}
//               clearFromCartHandler={clearFromCartHandler}
//               />
//             ))}
//           </div>
//         ) : (
//           <div className="no-products-container">
//             <h2>No products found for "{searchQuery}".</h2>
//             <button
//               onClick={() => {
//                 setSearchQuery("");
//                 setIsSearchingProducts(false);
//               }}
//             >
//               Show All Categories
//             </button>
//           </div>
//         )
//       ) : (
//         <div className="services-container">
//           {filteredCategories.map((service) => (
//             <motion.div
//               className="service-card"
//               key={service._id}
//               initial={{ scale: 0.8, y: 100 }}
//               animate={{ scale: 1, y: 0 }}
//               transition={{ duration: 0.4 }}
//             >
//               <Link to={`/category/${service.name.toLowerCase()}`} className="service-link">
//                 <img
//                   src={service.image.replace("http://", "https://")}
//                   alt={service.name}
//                   className="service-image"
//                 />
//                 <div className="service-details">
//                   <h2 className="service-title">{service.name}</h2>
//                 </div>
//               </Link>
//             </motion.div>
//           ))}
//         </div>
//       )}

//       {/* Mini Cart Popup */}
//       <MiniCart
//         cart={cart}
//         clearCart={clearCartHandler}
//         clearFromCart={clearFromCartHandler}
//         getTotalCartValue={() => getTotalCartValue(cart)}
//       />
//     </div>
//   );
// }

// export default AllServicesPage;


import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/allservice.css";
import "../../styles/cartpop.css";
import { motion } from "framer-motion";
import { makeApi } from "../../api/callApi";
import Loader from "../../components/loader/loader";
import MiniCart from "../popup/Minicart";
import { handleAddToCart, handleIncreaseQuantity, handleDecreaseQuantity, clearFromCart, clearCart, getTotalCartValue, handleUpdateShop } from "../utils/Cartutils"; // Import utility functions
import ProductCard from "../utils/Productcard";  // Import updated ProductCard

function AllServicesPage() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchingProducts, setIsSearchingProducts] = useState(false);
  const [cart, setCart] = useState({});
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      try {
        const response = await makeApi("/api/get-all-categories", "GET");
        const sortedCategories = response.data.sort((a, b) => a.poistionId - b.poistionId);
        setCategories(sortedCategories);
        setFilteredCategories(sortedCategories);
      } catch (error) {
        console.log("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setProducts([]);
      setFilteredCategories(categories);
      setIsSearchingProducts(false);
      return;
    }

    async function fetchProducts() {
      setLoading(true);
      try {
        const response = await makeApi(`/api/products/search?word=${searchQuery}`, "GET");
        setProducts(response.data.products);
        setIsSearchingProducts(true);
      } catch (error) {
        console.log("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [searchQuery, categories]);

  const handleUpdateShopHandler = (productId, newShop) => {
    setCart((prevCart) => handleUpdateShop(prevCart, productId, newShop, products));
  };

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || {};
    setCart(storedCart);
  }, []);

  useEffect(() => {
    if (!isInitialLoad) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, isInitialLoad]);

  const handleAddToCartHandler = (product) => {
    setCart((prevCart) => handleAddToCart(prevCart, product));
  };

  const handleIncreaseQuantityHandler = (product) => {
    setCart((prevCart) => handleIncreaseQuantity(prevCart, product));
  };

  const handleDecreaseQuantityHandler = (product) => {
    setCart((prevCart) => handleDecreaseQuantity(prevCart, product));
  };

  const clearFromCartHandler = (productId) => {
    setCart((prevCart) => clearFromCart(prevCart, productId));
  };

  const clearCartHandler = () => {
    setCart(clearCart());
    localStorage.removeItem("cart");
  };

  return (
    <div className="all-services-page">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for services or products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
          className="search-input"
        />
        {loading && (
          <div style={{ marginTop: "10px", display: "flex", justifyContent: "center" }}>
            <Loader />
          </div>
        )}
      </div>

      {isSearchingProducts ? (
        products.length > 0 ? (
          <div className="product-list">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                cart={cart}
                handleAddToCartHandler={handleAddToCartHandler}
                handleUpdateShopHandler={handleUpdateShopHandler}
                handleIncreaseQuantityHandler={handleIncreaseQuantityHandler}
                handleDecreaseQuantityHandler={handleDecreaseQuantityHandler}
                clearFromCartHandler={clearFromCartHandler}
              />
            ))}
          </div>
        ) : (
          <div className="no-products-container">
            <h2>No products found for "{searchQuery}".</h2>
            <button
              onClick={() => {
                setSearchQuery("");
                setIsSearchingProducts(false);
              }}
            >
              Show All Categories
            </button>
          </div>
        )
      ) : (
        <div className="services-container">
          {filteredCategories.map((service) => (
            <motion.div
              className="service-card"
              key={service._id}
              initial={{ scale: 0.8, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Link to={`/category/${service.name.toLowerCase()}`} className="service-link">
                <img
                  src={service.image.replace("http://", "https://")}
                  alt={service.name}
                  className="service-image"
                />
                <div className="service-details">
                  <h2 className="service-title">{service.name}</h2>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {/* Mini Cart Popup */}
      <MiniCart
        cart={cart}
        clearCart={clearCartHandler}
        clearFromCart={clearFromCartHandler}
        getTotalCartValue={() => getTotalCartValue(cart)}
      />
    </div>
  );
}

export default AllServicesPage;
