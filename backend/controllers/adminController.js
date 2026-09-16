const User = require("../models/userModel");
const Food = require("../models/foodModel");
const Order = require("../models/orderModel");

const getDashboardData = async (req, res) => {
    try {
        const [
            totalUsers,
            totalFoods,
            totalOrders,
            pendingOrders,
            confirmedOrders,
            preparingOrders,
            deliveredOrders,
            cancelledOrders
        ] = await Promise.all([
            User.countDocuments({ role: "customer" }),
            Food.countDocuments(),
            Order.countDocuments(),
            Order.countDocuments({ orderStatus: "pending" }),
            Order.countDocuments({ orderStatus: "confirmed" }),
            Order.countDocuments({ orderStatus: "preparing" }),
            Order.countDocuments({ orderStatus: "delivered" }),
            Order.countDocuments({ orderStatus: "cancelled" })
        ]);

        const dashboard = {
            totalUsers,
            totalFoods,
            totalOrders,
            pendingOrders,
            confirmedOrders,
            preparingOrders,
            deliveredOrders,
            cancelledOrders
        };

        return res.status(200).json({
            success: true,
            message: "Dashboard data fetched successfully",
            dashboard
        });

    } catch (error) {
        console.error("Dashboard Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard data",
            error: error.message
        });
    }
};

module.exports = {
    getDashboardData
};