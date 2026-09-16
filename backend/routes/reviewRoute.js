const express = require("express");

const {
    addReview,
    getFoodReviews,
    getMyReviews,
    updateReview,
    deleteReview,
    getAllReviews,
    adminDeleteReview
} = require("../controllers/reviewController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();


// ==================== CUSTOMER ====================


// Add review
router.post(
    "/add-review",
    authMiddleware,
    addReview
);


// Get reviews of a food
// Public API
router.get(
    "/get-food-reviews/:foodId",
    getFoodReviews
);


// Get logged-in user's reviews
router.get(
    "/get-my-reviews",
    authMiddleware,
    getMyReviews
);


// Update user's review
router.put(
    "/update-review/:id",
    authMiddleware,
    updateReview
);


// Delete user's review
router.delete(
    "/delete-review/:id",
    authMiddleware,
    deleteReview
);


// ==================== ADMIN ====================


// Get all reviews
router.get(
    "/get-all-reviews",
    authMiddleware,
    adminMiddleware,
    getAllReviews
);


// Admin delete review
router.delete(
    "/admin-delete-review/:id",
    authMiddleware,
    adminMiddleware,
    adminDeleteReview
);


module.exports = router;