import api from "./api";

// Create payment
export const createPayment = async (paymentData) => {
    try {
        const response = await api.post(
            "/payment/create-payment",
            paymentData
        );

        return response.data;
    } catch (error) {
        console.error(
            "Create Payment Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};


// Get payment by order ID
export const getPayment = async (orderId) => {
    try {
        const response = await api.get(
            `/payment/get-payment/${orderId}`
        );

        return response.data;
    } catch (error) {
        console.error(
            "Get Payment Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};


// Submit UPI payment / UTR
export const submitUpiPayment = async (
    orderId,
    transactionId
) => {

    try {

        const response = await api.post(
            "/payment/submit-upi",
            {
                orderId,
                transactionId
            }
        );

        return response.data;

    } catch (error) {

        console.error(
            "Submit UPI Payment Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};


// Get all payments
// Admin only
export const getAllPayments = async () => {
    try {
        const response = await api.get(
            "/payment/get-all-payments"
        );

        return response.data;
    } catch (error) {
        console.error(
            "Get All Payments Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};


// Verify UPI payment
// Admin only
export const verifyUpiPayment = async (id) => {
    try {
        const response = await api.put(
            `/payment/verify-upi/${id}`
        );

        return response.data;
    } catch (error) {
        console.error(
            "Verify UPI Payment Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};


// Reject UPI payment
// Admin only
export const rejectUpiPayment = async (id) => {
    try {
        const response = await api.put(
            `/payment/reject-upi/${id}`
        );

        return response.data;
    } catch (error) {
        console.error(
            "Reject UPI Payment Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};


// Mark cash payment as paid
// Admin only
export const markCashPaid = async (id) => {
    try {
        const response = await api.put(
            `/payment/mark-cash-paid/${id}`
        );

        return response.data;
    } catch (error) {
        console.error(
            "Mark Cash Paid Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};