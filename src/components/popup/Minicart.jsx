import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

function MiniCart({
  cart,
  clearCart,
  clearFromCart,
  getTotalCartValue,
}) {
  return (
    <AnimatePresence>
      {Object.keys(cart).length > 0 && (
        <motion.div
          className="mini-cart"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.4 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
                {item.name} from <b> {item.shop} </b>  x {item.quantity} = ₹{item.FinalPrice * item.quantity}
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
            <Link to="/cart" style={{ textDecoration: 'none' }}>
              <button className="buy-now-btn">Buy Now</button>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default MiniCart;
