const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        food: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Food",
            required: true
        },

        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },

        comment: {
            type: String,
            trim: true,
            maxlength: 1000,
            default: ""
        },

        images: {
            type: [String],
            default: []
        },

        isApproved: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);


// One user can review a food only once for the same order
reviewSchema.index(
    {
        user: 1,
        food: 1,
        order: 1
    },
    {
        unique: true
    }
);


const reviewModel = mongoose.model("Review", reviewSchema);

module.exports = reviewModel;