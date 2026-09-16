const mongoose = require("mongoose");

const Review = require("../models/reviewModel");
const Food = require("../models/foodModel");
const Order = require("../models/orderModel");


/**
 * @name updateFoodRating
 * @description Recalculate average rating and total reviews for a food
 */
async function updateFoodRating(foodId) {
    const result = await Review.aggregate([
        {
            $match: {
                food: new mongoose.Types.ObjectId(foodId),
                isApproved: true
            }
        },
        {
            $group: {
                _id: "$food",
                averageRating: {
                    $avg: "$rating"
                },
                totalReviews: {
                    $sum: 1
                }
            }
        }
    ]);


    if (result.length === 0) {
        await Food.findByIdAndUpdate(foodId, {
            rating: 0,
            totalReviews: 0
        });

        return;
    }


    await Food.findByIdAndUpdate(foodId, {
        rating: Number(result[0].averageRating.toFixed(1)),
        totalReviews: result[0].totalReviews
    });
}


/**
 * @name addReview
 * @description Add review for a delivered food order
 * @access Private
 */
async function addReview(req, res) {
    try {
        const userId = req.user?._id;

        const {
            foodId,
            orderId,
            rating,
            comment,
            images
        } = req.body;


        // Check authentication
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }


        // Validate food ID
        if (!foodId) {
            return res.status(400).json({
                success: false,
                message: "Food ID is required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(foodId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid food ID"
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


        // Validate rating
        if (
            rating === undefined ||
            rating === null ||
            !Number.isInteger(Number(rating))
        ) {
            return res.status(400).json({
                success: false,
                message: "Rating must be an integer between 1 and 5"
            });
        }


        const reviewRating = Number(rating);


        if (reviewRating < 1 || reviewRating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5"
            });
        }


        // Check food exists
        const food = await Food.findById(foodId);


        if (!food) {
            return res.status(404).json({
                success: false,
                message: "Food not found"
            });
        }


        // Check order belongs to user
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


        // Only delivered orders can be reviewed
        if (order.orderStatus !== "delivered") {
            return res.status(400).json({
                success: false,
                message: "You can review food only after the order is delivered"
            });
        }


        // Check whether food was actually part of this order
        const orderedFood = order.items.some(
            item => item.food.toString() === foodId.toString()
        );


        if (!orderedFood) {
            return res.status(400).json({
                success: false,
                message: "You can only review food from this order"
            });
        }


        // Check if review already exists
        const existingReview = await Review.findOne({
            user: userId,
            food: foodId,
            order: orderId
        });


        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: "You have already reviewed this food for this order"
            });
        }


        // Validate images
        if (images !== undefined && !Array.isArray(images)) {
            return res.status(400).json({
                success: false,
                message: "Images must be an array"
            });
        }


        // Create review
        const review = await Review.create({
            user: userId,
            food: foodId,
            order: orderId,
            rating: reviewRating,
            comment: comment || "",
            images: images || [],
            isApproved: true
        });


        // Update food rating
        await updateFoodRating(foodId);


        // Populate review
        await review.populate([
            {
                path: "user",
                select: "username"
            },
            {
                path: "food",
                select: "name images price discountPrice rating totalReviews"
            },
            {
                path: "order",
                select: "orderNumber"
            }
        ]);


        return res.status(201).json({
            success: true,
            message: "Review added successfully",
            review
        });

    } catch (error) {

        console.error("Add Review Error:", error);

        // Handle duplicate review index
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "You have already reviewed this food for this order"
            });
        }


        return res.status(500).json({
            success: false,
            message: "Failed to add review",
            error: error.message
        });
    }
}


/**
 * @name getFoodReviews
 * @description Get all approved reviews for a food
 * @access Public
 */
async function getFoodReviews(req, res) {
    try {
        const { foodId } = req.params;


        // Validate food ID
        if (!mongoose.Types.ObjectId.isValid(foodId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid food ID"
            });
        }


        // Check food exists
        const food = await Food.findById(foodId);


        if (!food) {
            return res.status(404).json({
                success: false,
                message: "Food not found"
            });
        }


        // Get approved reviews
        const reviews = await Review.find({
            food: foodId,
            isApproved: true
        })
            .populate("user", "username")
            .sort({
                createdAt: -1
            });


        return res.status(200).json({
            success: true,
            message: "Reviews fetched successfully",
            count: reviews.length,
            averageRating: food.rating,
            totalReviews: food.totalReviews,
            reviews
        });

    } catch (error) {

        console.error("Get Food Reviews Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch reviews",
            error: error.message
        });
    }
}


/**
 * @name getMyReviews
 * @description Get reviews created by logged-in user
 * @access Private
 */
async function getMyReviews(req, res) {
    try {
        const userId = req.user?._id;


        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }


        const reviews = await Review.find({
            user: userId
        })
            .populate(
                "food",
                "name images price discountPrice rating totalReviews"
            )
            .populate(
                "order",
                "orderNumber createdAt orderStatus"
            )
            .sort({
                createdAt: -1
            });


        return res.status(200).json({
            success: true,
            message: "Your reviews fetched successfully",
            count: reviews.length,
            reviews
        });

    } catch (error) {

        console.error("Get My Reviews Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch your reviews",
            error: error.message
        });
    }
}


/**
 * @name updateReview
 * @description Update user's review
 * @access Private
 */
async function updateReview(req, res) {
    try {
        const userId = req.user?._id;
        const { id } = req.params;

        const {
            rating,
            comment,
            images
        } = req.body;


        // Check authentication
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }


        // Validate review ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid review ID"
            });
        }


        // Find user's review
        const review = await Review.findOne({
            _id: id,
            user: userId
        });


        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }


        // Validate rating if provided
        if (rating !== undefined) {
            const reviewRating = Number(rating);


            if (
                !Number.isInteger(reviewRating) ||
                reviewRating < 1 ||
                reviewRating > 5
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Rating must be an integer between 1 and 5"
                });
            }


            review.rating = reviewRating;
        }


        // Update comment
        if (comment !== undefined) {
            review.comment = comment;
        }


        // Update images
        if (images !== undefined) {

            if (!Array.isArray(images)) {
                return res.status(400).json({
                    success: false,
                    message: "Images must be an array"
                });
            }

            review.images = images;
        }


        await review.save();


        // Recalculate rating
        await updateFoodRating(review.food);


        await review.populate([
            {
                path: "user",
                select: "username"
            },
            {
                path: "food",
                select: "name images price discountPrice rating totalReviews"
            },
            {
                path: "order",
                select: "orderNumber"
            }
        ]);


        return res.status(200).json({
            success: true,
            message: "Review updated successfully",
            review
        });

    } catch (error) {

        console.error("Update Review Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update review",
            error: error.message
        });
    }
}


/**
 * @name deleteReview
 * @description Delete user's review
 * @access Private
 */
async function deleteReview(req, res) {
    try {
        const userId = req.user?._id;
        const { id } = req.params;


        // Check authentication
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }


        // Validate review ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid review ID"
            });
        }


        // Find user's review
        const review = await Review.findOne({
            _id: id,
            user: userId
        });


        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }


        const foodId = review.food;


        // Delete review
        await Review.deleteOne({
            _id: id
        });


        // Recalculate food rating
        await updateFoodRating(foodId);


        return res.status(200).json({
            success: true,
            message: "Review deleted successfully"
        });

    } catch (error) {

        console.error("Delete Review Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete review",
            error: error.message
        });
    }
}


/**
 * @name getAllReviews
 * @description Get all reviews
 * @access Admin
 */
async function getAllReviews(req, res) {
    try {

        const reviews = await Review.find()
            .populate("user", "username email")
            .populate(
                "food",
                "name images price discountPrice"
            )
            .populate(
                "order",
                "orderNumber total orderStatus"
            )
            .sort({
                createdAt: -1
            });


        return res.status(200).json({
            success: true,
            message: "All reviews fetched successfully",
            count: reviews.length,
            reviews
        });

    } catch (error) {

        console.error("Get All Reviews Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch reviews",
            error: error.message
        });
    }
}


/**
 * @name adminDeleteReview
 * @description Admin deletes a review
 * @access Admin
 */
async function adminDeleteReview(req, res) {
    try {
        const { id } = req.params;


        // Validate review ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid review ID"
            });
        }


        // Find review
        const review = await Review.findById(id);


        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }


        const foodId = review.food;


        // Delete review
        await Review.findByIdAndDelete(id);


        // Recalculate rating
        await updateFoodRating(foodId);


        return res.status(200).json({
            success: true,
            message: "Review deleted successfully by admin"
        });

    } catch (error) {

        console.error("Admin Delete Review Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete review",
            error: error.message
        });
    }
}


module.exports = {
    addReview,
    getFoodReviews,
    getMyReviews,
    updateReview,
    deleteReview,
    getAllReviews,
    adminDeleteReview
};