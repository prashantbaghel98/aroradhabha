const express = require("express");

const {
    createOrder,
    getMyOrders,
    getOrder,
    cancelOrder,
    updateOrderStatus,
    getAllOrders,
    getAdminOrder
} = require("../controllers/orderController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();


// ==========================================
// CUSTOMER ROUTES
// ==========================================

// Create Order
router.post(
    "/create-order",
    authMiddleware,
    createOrder
);


// Get My Orders
router.get(
    "/get-my-orders",
    authMiddleware,
    getMyOrders
);


// Get Single Customer Order
router.get(
    "/get-order/:id",
    authMiddleware,
    getOrder
);


// Cancel Order
router.put(
    "/cancel-order/:id",
    authMiddleware,
    cancelOrder
);


// ==========================================
// ADMIN ROUTES
// ==========================================

// Get All Orders
router.get(
    "/get-all-orders",
    authMiddleware,
    adminMiddleware,
    getAllOrders
);


// Get Single Admin Order
router.get(
    "/admin/get-order/:id",
    authMiddleware,
    adminMiddleware,
    getAdminOrder
);


// Update Order Status
router.put(
    "/update-order-status/:id",
    authMiddleware,
    adminMiddleware,
    updateOrderStatus
);


module.exports = router;