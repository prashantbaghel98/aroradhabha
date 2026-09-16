const express = require("express");
const {  addToCart,getCartItems,updateCartItem,removeFromCart, clearCart} = require("../controllers/cartController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// Add food to cart
router.post( "/add-to-cart",authMiddleware,addToCart);


// Get user's cart
router.get("/get-cart-items",authMiddleware,getCartItems);


// Update cart item quantity
router.put( "/update-cart-item/:foodId",authMiddleware,updateCartItem);


// Remove food from cart
router.delete( "/remove-from-cart/:foodId", authMiddleware,removeFromCart);


// Clear complete cart
router.delete("/clear-cart",authMiddleware,clearCart);


module.exports = router;