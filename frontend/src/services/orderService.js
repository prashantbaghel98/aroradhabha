import api from "./api";


// ==========================================
// CREATE ORDER
// Customer
// ==========================================

export const createOrder = async (orderData) => {
    try {

        const response = await api.post(
            "/order/create-order",
            orderData
        );

        return response.data;

    } catch (error) {

        console.error(
            "Create Order Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};


// ==========================================
// GET MY ORDERS
// Customer
// ==========================================

export const getMyOrders = async () => {
    try {

        const response = await api.get(
            "/order/get-my-orders"
        );

        return response.data;

    } catch (error) {

        console.error(
            "Get My Orders Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};


// ==========================================
// GET SINGLE ORDER
// Customer
// ==========================================

export const getOrderById = async (id) => {
    try {

        const response = await api.get(
            `/order/get-order/${id}`
        );

        return response.data;

    } catch (error) {

        console.error(
            "Get Order Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};


// ==========================================
// GET SINGLE ORDER
// Admin
// ==========================================

export const getAdminOrderById = async (id) => {
    try {

        const response = await api.get(
            `/order/admin/get-order/${id}`
        );

        return response.data;

    } catch (error) {

        console.error(
            "Get Admin Order Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};


// ==========================================
// CANCEL ORDER
// Customer
// ==========================================

export const cancelOrder = async (id) => {
    try {

        const response = await api.put(
            `/order/cancel-order/${id}`
        );

        return response.data;

    } catch (error) {

        console.error(
            "Cancel Order Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};


// ==========================================
// UPDATE ORDER STATUS
// Admin
// ==========================================

export const updateOrderStatus = async (
    id,
    orderStatus
) => {
    try {

        const response = await api.put(
            `/order/update-order-status/${id}`,
            {
                orderStatus
            }
        );

        return response.data;

    } catch (error) {

        console.error(
            "Update Order Status Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};


// ==========================================
// GET ALL ORDERS
// Admin
// ==========================================

export const getAllOrders = async () => {
    try {

        const response = await api.get(
            "/order/get-all-orders"
        );

        return response.data;

    } catch (error) {

        console.error(
            "Get All Orders Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};