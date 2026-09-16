const express = require("express");

const {
    createFood,
    getAllFood,
    getFoodById,
    updateFood,
    deleteFood
} = require("../controllers/foodController");

const {
    upload,
    uploadToCloudinary
} = require("../middleware/uploadMiddleware");

const authMiddleware =
    require("../middleware/authMiddleware");

const adminMiddleware =
    require("../middleware/adminMiddleware");

const router = express.Router();


// ==========================================
// PUBLIC FOOD ROUTES
// ==========================================

// Get all foods
router.get(
    "/get-food",
    getAllFood
);


// Get single food
router.get(
    "/get-food/:id",
    getFoodById
);


// ==========================================
// ADMIN FOOD ROUTES
// ==========================================

// Add food
router.post(
    "/add-food",
    authMiddleware,
    adminMiddleware,
    upload.array("images", 5),
    uploadToCloudinary,
    createFood
);


// Update food
router.put(
    "/update-food/:id",
    authMiddleware,
    adminMiddleware,
    upload.array("images", 5),
    uploadToCloudinary,
    updateFood
);


// Delete food
router.delete(
    "/delete-food/:id",
    authMiddleware,
    adminMiddleware,
    deleteFood
);


module.exports = router;