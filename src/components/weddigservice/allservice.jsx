
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/allservice.css";
import "../../styles/cartpop.css";
import { motion, AnimatePresence } from "framer-motion";
import { makeApi } from "../../api/callApi";
import Loader from "../../components/loader/loader";

function AllServicesPage() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchingProducts, setIsSearchingProducts] = useState(false);
  const [cart, setCart] = useState({});
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [topsall, setTopsall] = useState([]);

  // Fetch categories on mount
  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      try {

        const response = await makeApi("/api/get-all-categories", "GET");

        // Sort categories by position
        const sortedCategories = response.data.sort((a, b) => a.poistionId - b.poistionId);

        setCategories(sortedCategories);
        setFilteredCategories(sortedCategories); // Initially display all categories
      } catch (error) {
        console.log("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);
  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      try {
        const response = await makeApi("/api/gettopsaller", "GET");
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

        setTopsall(updatedProducts);
        // setTopsall(response.data.products);
      } catch (error) {
        console.log("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  // Fetch products on search query change
  useEffect(() => {
    if (!searchQuery) {
      setProducts([]);
      setIsSearchingProducts(false);
      return;
    }

    async function fetchProducts() {
      setLoading(true);
      try {
        const response = await makeApi(`/api/products/search?word=${searchQuery}`, "GET");
        // setProducts(response.data.products);
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
        setIsSearchingProducts(true);
      } catch (error) {
        console.log("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [searchQuery]);
  const clearCart = () => {
    setCart({});
    localStorage.removeItem("cart"); // Clear the cart data from localStorage
  };


  // Load cart from localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || {};
    setCart(storedCart);
    setIsInitialLoad(false);
  }, []);

  // Update localStorage when cart changes
  useEffect(() => {
    if (!isInitialLoad) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, isInitialLoad]);

  // Clear cart periodically
  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.removeItem("cart");
      setCart({});
    }, 600000); // 10 minutes

    return () => clearInterval(interval);
  }, []);

  const getTotalCartValue = () => {
    return Object.values(cart).reduce(
      (total, item) => total + item.FinalPrice * item.quantity,
      0
    );
  };

  // const handleAddToCart = (product, selectedShop) => {
  //   const shopDetails = product.shopPrices.find(
  //     (shop) => shop.shopname === selectedShop
  //   );
  //   setCart((prevCart) => ({
  //     ...prevCart,
  //     [product._id]: {
  //       ...product,
  //       shop: selectedShop,
  //       FinalPrice: shopDetails?.price || product.FinalPrice,
  //       quantity: product.minorderquantity || 1,
  //     },
  //   }));
  // };
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
  return (
    <div className="all-services-page">
      <div className="product-list">
        {topsall.map((product) => (
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
            <div className="product-info" style={{ textAlign: "left" }} >
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
              <div style={{ display: "flex", alignItems: "center" }} >
                <div>
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
                </div>
                <div>
                  {cart[product._id] ? (
                    <div className="quantity-control"  >
                      <div style={{marginBottom:"4px"}} >

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
                        </div>
                        <div>

                      <motion.button
                        className="remove-btn"
                        onClick={() => clearFromCart(product._id)}
                        >
                        Remove
                      </motion.button>
                        </div>
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
              </div>
            </div>
          </motion.div>
        ))}
      </div>
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
              <Link
                to={`/category/${service.name.toLowerCase()}`}
                className="service-link"
              >
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
      <div style={{ height: "60vh" }} ></div>

    </div>
  );
}

export default AllServicesPage;