const express = require("express");

const {
    createPayment,
    submitUPIPayment,
    getMyPayment,
    getAllPayments,
    verifyUPIPayment,
    rejectUPIPayment,
    markCashPaymentPaid
} = require("../controllers/paymentController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();


// ==================== CUSTOMER ====================


// Create payment
router.post(
    "/create-payment",
    authMiddleware,
    createPayment
);


// Submit UPI UTR
router.post(
    "/submit-upi",
    authMiddleware,
    submitUPIPayment
);


// Get payment for order
router.get(
    "/get-payment/:orderId",
    authMiddleware,
    getMyPayment
);


// ==================== ADMIN ====================


// Get all payments / payment history
router.get(
    "/get-all-payments",
    authMiddleware,
    adminMiddleware,
    getAllPayments
);


// Verify UPI payment
router.put(
    "/verify-upi/:id",
    authMiddleware,
    adminMiddleware,
    verifyUPIPayment
);


// Reject UPI payment
router.put(
    "/reject-upi/:id",
    authMiddleware,
    adminMiddleware,
    rejectUPIPayment
);


// Mark cash payment as paid
router.put(
    "/mark-cash-paid/:id",
    authMiddleware,
    adminMiddleware,
    markCashPaymentPaid
);


module.exports = router;