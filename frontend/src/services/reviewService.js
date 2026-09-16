import api from "./api";

// Add review
export const addReview = async (reviewData) => {
    try {
        const response = await api.post(
            "/review/add-review",
            reviewData
        );

        return response.data;
    } catch (error) {
        console.error(
            "Add Review Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};

// Get reviews for food
export const getFoodReviews = async (foodId) => {
    try {
        const response = await api.get(
            `/review/get-food-reviews/${foodId}`
        );

        return response.data;
    } catch (error) {
        console.error(
            "Get Food Reviews Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};

// Get my reviews
export const getMyReviews = async () => {
    try {
        const response = await api.get(
            "/review/get-my-reviews"
        );

        return response.data;
    } catch (error) {
        console.error(
            "Get My Reviews Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};

// Update review
export const updateReview = async (
    id,
    reviewData
) => {
    try {
        const response = await api.put(
            `/review/update-review/${id}`,
            reviewData
        );

        return response.data;
    } catch (error) {
        console.error(
            "Update Review Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};

// Delete review
export const deleteReview = async (id) => {
    try {
        const response = await api.delete(
            `/review/delete-review/${id}`
        );

        return response.data;
    } catch (error) {
        console.error(
            "Delete Review Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};

// Get all reviews
// Admin only
export const getAllReviews = async () => {
    try {
        const response = await api.get(
            "/review/get-all-reviews"
        );

        return response.data;
    } catch (error) {
        console.error(
            "Get All Reviews Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};

// Admin delete review
export const adminDeleteReview = async (id) => {
    try {
        const response = await api.delete(
            `/review/admin-delete-review/${id}`
        );

        return response.data;
    } catch (error) {
        console.error(
            "Admin Delete Review Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};