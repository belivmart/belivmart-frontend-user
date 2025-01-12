export const handleAddToCart = (cart, product, selectedShop = "") => {
    return {
      ...cart,
      [product._id]: {
        ...product,
        quantity: 1, 
        shop: selectedShop,
        FinalPrice: selectedShop
          ? product.shopPrices?.find((shop) => shop.shopname === selectedShop)?.price || product.FinalPrice
          : product.FinalPrice,
      },
    };
  };
  
  export const handleUpdateShop = (cart, productId, newShop, products) => {
    const updatedCart = { ...cart };
    const product = products.find((prod) => prod._id === productId);
  
    if (updatedCart[productId] && product) {
      const shopPrice = product.shopPrices?.find((shop) => shop.shopname === newShop);
      updatedCart[productId].shop = newShop;
      updatedCart[productId].FinalPrice = shopPrice ? shopPrice.price : product.FinalPrice;
    }
  
    return updatedCart;
  };
  
  export const handleIncreaseQuantity = (cart, product) => {
    const updatedCart = { ...cart };
    if (updatedCart[product._id]) {
      console.log("Existing product in cart, increasing quantity for:", product._id);
      updatedCart[product._id].quantity += 1; // Increment by 1
    } else {
      console.log("Adding new product to cart:", product._id);
      updatedCart[product._id] = {
        ...product,
        quantity: 1,
      };
    }
    console.log("Updated cart state:", updatedCart);
    return updatedCart;
  };
  
  
  
  
  export const handleDecreaseQuantity = (cart, product) => {
    const updatedCart = { ...cart };
    if (updatedCart[product._id]) {
      updatedCart[product._id].quantity = Math.max(updatedCart[product._id].quantity - 1, 1);
    }
    return updatedCart;
  };
  
  
  export const clearFromCart = (cart, productId) => {
    const updatedCart = { ...cart };
    delete updatedCart[productId]; // Remove product from cart by productId
    return updatedCart;
  };
  
  export const clearCart = () => {
    return {}; // Empty cart object
  };
  
  export const getTotalCartValue = (cart) => {
    // Calculate total value of the cart based on FinalPrice and quantity
    return Object.values(cart).reduce(
      (total, item) => total + item.FinalPrice * item.quantity,
      0
    );
  };
  