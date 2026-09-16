import api from "./api";

// Get cart
export const getCart = async () => {
    try {
        const response = await api.get(
            "/cart/get-cart-items"
        );

        return response.data;
    } catch (error) {
        console.error(
            "Get Cart Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};

// Add to cart
export const addToCart = async (
    foodId,
    quantity = 1
) => {
    try {
        const response = await api.post(
            "/cart/add-to-cart",
            {
                foodId,
                quantity
            }
        );

        return response.data;
    } catch (error) {
        console.error(
            "Add To Cart Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};

// Update cart item
export const updateCartItem = async (
    foodId,
    quantity
) => {
    try {
        const response = await api.put(
            `/cart/update-cart-item/${foodId}`,
            {
                quantity
            }
        );

        return response.data;
    } catch (error) {
        console.error(
            "Update Cart Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};

// Remove from cart
export const removeFromCart = async (foodId) => {
    try {
        const response = await api.delete(
            `/cart/remove-from-cart/${foodId}`
        );

        return response.data;
    } catch (error) {
        console.error(
            "Remove Cart Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};

// Clear cart
export const clearCart = async () => {
    try {
        const response = await api.delete(
            "/cart/clear-cart"
        );

        return response.data;
    } catch (error) {
        console.error(
            "Clear Cart Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};