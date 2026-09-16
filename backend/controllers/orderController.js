const mongoose = require("mongoose");

const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const Food = require("../models/foodModel");
const Address = require("../models/addressModel");


/**
 * @name generateOrderNumber
 * @description Generate unique order number
 */
function generateOrderNumber() {

    const timestamp = Date.now();

    const random = Math.floor(
        1000 + Math.random() * 9000
    );

    return `ORD-${timestamp}-${random}`;
}


/**
 * @name createOrder
 * @description Create a new order from user's cart
 * @access Private
 */
async function createOrder(req, res) {

    try {

        const userId = req.user?._id;

        const {
            addressId,
            paymentMethod,
            customerNote
        } = req.body;


        // ==========================================
        // CHECK AUTHENTICATION
        // ==========================================

        if (!userId) {

            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });

        }


        // ==========================================
        // VALIDATE ADDRESS ID
        // ==========================================

        if (!addressId) {

            return res.status(400).json({
                success: false,
                message: "Address ID is required"
            });

        }


        if (!mongoose.Types.ObjectId.isValid(addressId)) {

            return res.status(400).json({
                success: false,
                message: "Invalid address ID"
            });

        }


        // ==========================================
        // VALIDATE PAYMENT METHOD
        // ==========================================

        const allowedPaymentMethods = [
            "cash",
            "card",
            "upi",
            "online"
        ];


        if (!paymentMethod) {

            return res.status(400).json({
                success: false,
                message: "Payment method is required"
            });

        }


        if (!allowedPaymentMethods.includes(paymentMethod)) {

            return res.status(400).json({
                success: false,
                message: "Invalid payment method"
            });

        }


        // ==========================================
        // FIND USER CART
        // ==========================================

        const cart = await Cart.findOne({
            user: userId
        });


        if (
            !cart ||
            !cart.items ||
            cart.items.length === 0
        ) {

            return res.status(400).json({
                success: false,
                message: "Your cart is empty"
            });

        }


        // ==========================================
        // FIND USER ADDRESS
        // ==========================================

        const address = await Address.findOne({
            _id: addressId,
            user: userId
        });


        if (!address) {

            return res.status(404).json({
                success: false,
                message: "Address not found"
            });

        }


        // ==========================================
        // PREPARE ORDER ITEMS
        // ==========================================

        const orderItems = [];

        let subtotal = 0;


        for (const cartItem of cart.items) {

            // Get latest food information
            const food = await Food.findById(
                cartItem.food
            );


            if (!food) {

                return res.status(404).json({
                    success: false,
                    message: `Food not found for item ${cartItem.food}`
                });

            }


            // Check availability
            if (!food.isAvailable) {

                return res.status(400).json({
                    success: false,
                    message: `${food.name} is currently unavailable`
                });

            }


            // Get current selling price
            const price =
                food.discountPrice &&
                food.discountPrice > 0
                    ? food.discountPrice
                    : food.price;


            // Calculate item total
            const itemTotal =
                price * cartItem.quantity;


            orderItems.push({
                food: food._id,
                name: food.name,
                quantity: cartItem.quantity,
                price: price,
                total: itemTotal
            });


            subtotal += itemTotal;

        }


        // ==========================================
        // CALCULATE TOTALS
        // ==========================================

        const deliveryFee =
            subtotal > 0 ? 40 : 0;

        const discount = 0;

        const tax = 0;

        const total =
            subtotal +
            deliveryFee +
            tax -
            discount;


        // ==========================================
        // DELIVERY ADDRESS SNAPSHOT
        // ==========================================

        const deliveryAddress = {

            name: address.name,

            phone: address.phone,

            addressLine1:
                address.addressLine1,

            addressLine2:
                address.addressLine2 || "",

            landmark:
                address.landmark || "",

            city: address.city,

            state: address.state,

            pincode: address.pincode,

            addressType:
                address.addressType

        };


        // ==========================================
        // GENERATE ORDER NUMBER
        // ==========================================

        const orderNumber =
            generateOrderNumber();


        // ==========================================
        // CREATE ORDER
        // ==========================================

        const order = await Order.create({

            orderNumber,

            user: userId,

            deliveryAddress,

            items: orderItems,

            subtotal,

            deliveryFee,

            discount,

            tax,

            total,

            paymentMethod,

            paymentStatus: "pending",

            orderStatus: "pending",

            customerNote:
                customerNote || "",

            estimatedDeliveryTime: null

        });


        // ==========================================
        // CLEAR CART
        // ==========================================

        cart.items = [];

        cart.subtotal = 0;

        cart.discount = 0;

        cart.deliveryFee = 0;

        cart.total = 0;


        await cart.save();


        // ==========================================
        // RESPONSE
        // ==========================================

        return res.status(201).json({

            success: true,

            message: "Order created successfully",

            order

        });

    } catch (error) {

        console.error(
            "Create Order Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message: "Failed to create order",

            error: error.message

        });

    }
}


/**
 * @name getMyOrders
 * @description Get all orders of logged-in user
 * @access Private
 */
async function getMyOrders(req, res) {

    try {

        const userId = req.user?._id;


        if (!userId) {

            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });

        }


        const orders = await Order.find({
            user: userId
        })
            .populate(
                "items.food",
                "name price discountPrice images"
            )
            .sort({
                createdAt: -1
            });


        return res.status(200).json({

            success: true,

            message: "Orders fetched successfully",

            count: orders.length,

            orders

        });

    } catch (error) {

        console.error(
            "Get My Orders Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message: "Failed to fetch orders",

            error: error.message

        });

    }
}


/**
 * @name getOrder
 * @description Get single order of logged-in user
 * @access Private
 */
async function getOrder(req, res) {

    try {

        const userId = req.user?._id;

        const { id } = req.params;


        if (!userId) {

            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });

        }


        if (!mongoose.Types.ObjectId.isValid(id)) {

            return res.status(400).json({
                success: false,
                message: "Invalid order ID"
            });

        }


        const order = await Order.findOne({

            _id: id,

            user: userId

        })
            .populate(
                "items.food",
                "name price discountPrice images"
            );


        if (!order) {

            return res.status(404).json({

                success: false,

                message: "Order not found"

            });

        }


        return res.status(200).json({

            success: true,

            message: "Order fetched successfully",

            order

        });

    } catch (error) {

        console.error(
            "Get Order Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message: "Failed to fetch order",

            error: error.message

        });

    }
}


/**
 * @name getAdminOrder
 * @description Get single order for admin
 * @access Admin
 */
async function getAdminOrder(req, res) {

    try {

        const { id } = req.params;


        // ==========================================
        // VALIDATE ORDER ID
        // ==========================================

        if (!mongoose.Types.ObjectId.isValid(id)) {

            return res.status(400).json({

                success: false,

                message: "Invalid order ID"

            });

        }


        // ==========================================
        // FIND ORDER
        // ==========================================

        const order = await Order.findById(id)

            .populate(
                "user",
                "username email"
            )

            .populate(
                "items.food",
                "name price discountPrice images"
            );


        if (!order) {

            return res.status(404).json({

                success: false,

                message: "Order not found"

            });

        }


        // ==========================================
        // RESPONSE
        // ==========================================

        return res.status(200).json({

            success: true,

            message: "Order fetched successfully",

            order

        });

    } catch (error) {

        console.error(
            "Get Admin Order Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message: "Failed to fetch order",

            error: error.message

        });

    }
}


/**
 * @name cancelOrder
 * @description Cancel user's order
 * @access Private
 */
async function cancelOrder(req, res) {

    try {

        const userId = req.user?._id;

        const { id } = req.params;


        if (!userId) {

            return res.status(401).json({

                success: false,

                message: "Unauthorized"

            });

        }


        if (!mongoose.Types.ObjectId.isValid(id)) {

            return res.status(400).json({

                success: false,

                message: "Invalid order ID"

            });

        }


        const order = await Order.findOne({

            _id: id,

            user: userId

        });


        if (!order) {

            return res.status(404).json({

                success: false,

                message: "Order not found"

            });

        }


        if (order.orderStatus === "cancelled") {

            return res.status(400).json({

                success: false,

                message: "Order is already cancelled"

            });

        }


        const nonCancellableStatuses = [

            "preparing",

            "ready",

            "out_for_delivery",

            "delivered"

        ];


        if (
            nonCancellableStatuses.includes(
                order.orderStatus
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Order cannot be cancelled at this stage"

            });

        }


        order.orderStatus = "cancelled";


        await order.save();


        return res.status(200).json({

            success: true,

            message: "Order cancelled successfully",

            order

        });

    } catch (error) {

        console.error(
            "Cancel Order Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message: "Failed to cancel order",

            error: error.message

        });

    }
}


/**
 * @name updateOrderStatus
 * @description Admin updates order status
 * @access Admin
 */
async function updateOrderStatus(req, res) {

    try {

        const { id } = req.params;

        const { orderStatus } = req.body;


        // ==========================================
        // VALIDATE ORDER ID
        // ==========================================

        if (!mongoose.Types.ObjectId.isValid(id)) {

            return res.status(400).json({

                success: false,

                message: "Invalid order ID"

            });

        }


        // ==========================================
        // VALIDATE STATUS
        // ==========================================

        const allowedStatuses = [

            "pending",

            "confirmed",

            "preparing",

            "ready",

            "out_for_delivery",

            "delivered",

            "cancelled"

        ];


        if (!orderStatus) {

            return res.status(400).json({

                success: false,

                message: "Order status is required"

            });

        }


        if (
            !allowedStatuses.includes(
                orderStatus
            )
        ) {

            return res.status(400).json({

                success: false,

                message: "Invalid order status"

            });

        }


        // ==========================================
        // FIND ORDER
        // ==========================================

        const order =
            await Order.findById(id);


        if (!order) {

            return res.status(404).json({

                success: false,

                message: "Order not found"

            });

        }


        // ==========================================
        // PREVENT INVALID UPDATES
        // ==========================================

        if (
            order.orderStatus === "cancelled"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Cancelled order cannot be updated"

            });

        }


        if (
            order.orderStatus === "delivered"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Delivered order cannot be updated"

            });

        }


        // ==========================================
        // UPDATE STATUS
        // ==========================================

        order.orderStatus = orderStatus;


        // COD payment automatically becomes paid
        // when order is delivered

        if (

            orderStatus === "delivered" &&

            order.paymentMethod === "cash" &&

            order.paymentStatus === "pending"

        ) {

            order.paymentStatus = "paid";

        }


        await order.save();


        return res.status(200).json({

            success: true,

            message:
                "Order status updated successfully",

            order

        });

    } catch (error) {

        console.error(
            "Update Order Status Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to update order status",

            error: error.message

        });

    }
}


/**
 * @name getAllOrders
 * @description Get all orders
 * @access Admin
 */
async function getAllOrders(req, res) {

    try {

        const orders = await Order.find()

            .populate(
                "user",
                "username email"
            )

            .populate(
                "items.food",
                "name price discountPrice images"
            )

            .sort({
                createdAt: -1
            });


        return res.status(200).json({

            success: true,

            message:
                "All orders fetched successfully",

            count: orders.length,

            orders

        });

    } catch (error) {

        console.error(
            "Get All Orders Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to fetch all orders",

            error: error.message

        });

    }
}


/**
 * ==========================================
 * EXPORT CONTROLLERS
 * ==========================================
 */

module.exports = {

    createOrder,

    getMyOrders,

    getOrder,

    getAdminOrder,

    cancelOrder,

    updateOrderStatus,

    getAllOrders

};