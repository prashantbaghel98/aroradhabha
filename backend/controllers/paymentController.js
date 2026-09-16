const mongoose = require("mongoose");

const Payment = require("../models/paymentModel");
const Order = require("../models/orderModel");


/**
 * @name createPayment
 * @description Create payment record for an order
 * @access Private
 */
async function createPayment(req, res) {
    try {
        const userId = req.user?._id;

        const {
            orderId,
            method
        } = req.body;


        // Check authentication
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }


        // Validate order ID
        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "Order ID is required"
            });
        }


        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID"
            });
        }


        // Validate payment method
        if (!method) {
            return res.status(400).json({
                success: false,
                message: "Payment method is required"
            });
        }


        if (!["cash", "upi"].includes(method)) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment method"
            });
        }


        // Find order belonging to logged-in user
        const order = await Order.findOne({
            _id: orderId,
            user: userId
        });


        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }


        // Don't allow payment for cancelled order
        if (order.orderStatus === "cancelled") {
            return res.status(400).json({
                success: false,
                message: "Payment cannot be created for a cancelled order"
            });
        }


        // Check existing payment
        const existingPayment = await Payment.findOne({
            order: orderId
        });


        if (existingPayment) {
            return res.status(400).json({
                success: false,
                message: "Payment already exists for this order",
                payment: existingPayment
            });
        }


        // Create payment
        const payment = await Payment.create({
            order: order._id,
            user: userId,
            amount: order.total,
            method,
            status: "pending",
            provider: method === "cash" ? "cash" : "upi"
        });


        // Keep order payment status pending
        order.paymentStatus = "pending";

        await order.save();


        return res.status(201).json({
            success: true,
            message: "Payment created successfully",
            payment
        });

    } catch (error) {

        console.error("Create Payment Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create payment",
            error: error.message
        });
    }
}


/**
 * @name submitUPIPayment
 * @description Customer submits UPI transaction/UTR number
 * @access Private
 */
async function submitUPIPayment(req, res) {
    try {
        const userId = req.user?._id;

        const {
            orderId,
            transactionId
        } = req.body;


        // Check authentication
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }


        // Validate order ID
        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "Order ID is required"
            });
        }


        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID"
            });
        }


        // Validate transaction ID / UTR
        if (!transactionId || !transactionId.trim()) {
            return res.status(400).json({
                success: false,
                message: "UTR / transaction ID is required"
            });
        }


        // Find payment
        const payment = await Payment.findOne({
            order: orderId,
            user: userId
        });


        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found"
            });
        }


        // Payment must be UPI
        if (payment.method !== "upi") {
            return res.status(400).json({
                success: false,
                message: "This payment is not a UPI payment"
            });
        }


        // Don't allow submitting again after paid
        if (payment.status === "paid") {
            return res.status(400).json({
                success: false,
                message: "Payment is already verified"
            });
        }


        // Don't allow cancelled payment
        if (payment.status === "cancelled") {
            return res.status(400).json({
                success: false,
                message: "Payment has been cancelled"
            });
        }


        // Save UTR
        payment.transactionId = transactionId.trim();

        // Waiting for admin verification
        payment.status = "processing";

        await payment.save();


        // Order remains pending until admin verifies payment
        const order = await Order.findById(orderId);

        if (order) {
            order.paymentStatus = "pending";
            await order.save();
        }


        return res.status(200).json({
            success: true,
            message: "UTR submitted successfully. Payment is waiting for admin verification.",
            payment
        });

    } catch (error) {

        console.error("Submit UPI Payment Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to submit UTR",
            error: error.message
        });
    }
}


/**
 * @name getMyPayment
 * @description Get payment details for customer's order
 * @access Private
 */
async function getMyPayment(req, res) {
    try {
        const userId = req.user?._id;
        const { orderId } = req.params;


        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }


        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID"
            });
        }


        const payment = await Payment.findOne({
            order: orderId,
            user: userId
        })
            .populate("order", "orderNumber total orderStatus paymentStatus");


        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found"
            });
        }


        return res.status(200).json({
            success: true,
            message: "Payment fetched successfully",
            payment
        });

    } catch (error) {

        console.error("Get My Payment Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch payment",
            error: error.message
        });
    }
}


/**
 * @name getAllPayments
 * @description Admin gets all payments
 * @access Admin
 */
async function getAllPayments(req, res) {
    try {

        const payments = await Payment.find()
            .populate("user", "username email")
            .populate("order", "orderNumber total orderStatus")
            .populate("verifiedBy", "username email")
            .sort({
                createdAt: -1
            });


        return res.status(200).json({
            success: true,
            message: "Payments fetched successfully",
            count: payments.length,
            payments
        });

    } catch (error) {

        console.error("Get All Payments Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch payments",
            error: error.message
        });
    }
}


/**
 * @name verifyUPIPayment
 * @description Admin verifies customer UPI payment
 * @access Admin
 */
async function verifyUPIPayment(req, res) {
    try {
        const adminId = req.user?._id;
        const { id } = req.params;


        // Check authentication
        if (!adminId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }


        // Validate payment ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment ID"
            });
        }


        // Find payment
        const payment = await Payment.findById(id);


        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found"
            });
        }


        // Only UPI payment can be verified through UTR
        if (payment.method !== "upi") {
            return res.status(400).json({
                success: false,
                message: "Only UPI payments can be verified using UTR"
            });
        }


        // UTR must exist
        if (!payment.transactionId) {
            return res.status(400).json({
                success: false,
                message: "Customer has not submitted UTR"
            });
        }


        // Already paid
        if (payment.status === "paid") {
            return res.status(400).json({
                success: false,
                message: "Payment is already verified"
            });
        }


        // Find order
        const order = await Order.findById(payment.order);


        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Associated order not found"
            });
        }


        // Don't verify cancelled order
        if (order.orderStatus === "cancelled") {
            return res.status(400).json({
                success: false,
                message: "Cannot verify payment for cancelled order"
            });
        }


        // Mark payment as paid
        payment.status = "paid";
        payment.paidAt = new Date();
        payment.verifiedAt = new Date();
        payment.verifiedBy = adminId;

        await payment.save();


        // Update order payment status
        order.paymentStatus = "paid";

        // Confirm order after successful payment
        if (order.orderStatus === "pending") {
            order.orderStatus = "confirmed";
        }

        await order.save();


        return res.status(200).json({
            success: true,
            message: "UPI payment verified successfully",
            payment,
            order
        });

    } catch (error) {

        console.error("Verify UPI Payment Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to verify payment",
            error: error.message
        });
    }
}


/**
 * @name rejectUPIPayment
 * @description Admin rejects an invalid UPI payment
 * @access Admin
 */
async function rejectUPIPayment(req, res) {
    try {
        const adminId = req.user?._id;
        const { id } = req.params;


        if (!adminId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }


        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment ID"
            });
        }


        const payment = await Payment.findById(id);


        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found"
            });
        }


        if (payment.method !== "upi") {
            return res.status(400).json({
                success: false,
                message: "Only UPI payments can be rejected"
            });
        }


        if (payment.status === "paid") {
            return res.status(400).json({
                success: false,
                message: "Paid payment cannot be rejected"
            });
        }


        payment.status = "failed";

        payment.verifiedAt = new Date();
        payment.verifiedBy = adminId;

        await payment.save();


        const order = await Order.findById(payment.order);


        if (order) {
            order.paymentStatus = "failed";
            await order.save();
        }


        return res.status(200).json({
            success: true,
            message: "UPI payment rejected",
            payment
        });

    } catch (error) {

        console.error("Reject UPI Payment Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to reject payment",
            error: error.message
        });
    }
}


/**
 * @name markCashPaymentPaid
 * @description Admin marks cash payment as paid after receiving cash
 * @access Admin
 */
async function markCashPaymentPaid(req, res) {
    try {
        const adminId = req.user?._id;
        const { id } = req.params;


        if (!adminId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }


        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment ID"
            });
        }


        const payment = await Payment.findById(id);


        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found"
            });
        }


        // Must be cash
        if (payment.method !== "cash") {
            return res.status(400).json({
                success: false,
                message: "This is not a cash payment"
            });
        }


        // Already paid
        if (payment.status === "paid") {
            return res.status(400).json({
                success: false,
                message: "Payment is already paid"
            });
        }


        const order = await Order.findById(payment.order);


        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Associated order not found"
            });
        }


        if (order.orderStatus === "cancelled") {
            return res.status(400).json({
                success: false,
                message: "Cannot mark payment for cancelled order as paid"
            });
        }


        // Mark cash payment as paid
        payment.status = "paid";
        payment.paidAt = new Date();
        payment.verifiedAt = new Date();
        payment.verifiedBy = adminId;

        await payment.save();


        // Update order
        order.paymentStatus = "paid";

        if (order.orderStatus === "pending") {
            order.orderStatus = "confirmed";
        }

        await order.save();


        return res.status(200).json({
            success: true,
            message: "Cash payment marked as paid successfully",
            payment,
            order
        });

    } catch (error) {

        console.error("Mark Cash Payment Paid Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update cash payment",
            error: error.message
        });
    }
}


module.exports = {
    createPayment,
    submitUPIPayment,
    getMyPayment,
    getAllPayments,
    verifyUPIPayment,
    rejectUPIPayment,
    markCashPaymentPaid
};