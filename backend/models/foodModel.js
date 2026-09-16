const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
    {
        category: {
            type: String,
            enum: ["Noodle", "Staters", "Momos", "Burgers","Rice","Tandoori Zaika,","Roti & Naan","Beverages","Desserts"],
            required: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        images: {
            type: [String],
            required: true
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        discountPrice: {
            type: Number,
            default: null,
            min: 0
        },

        foodType: {
            type: String,
            enum: ["veg", "non-veg", "egg"],
            required: true
        },

        isAvailable: {
            type: Boolean,
            default: true
        },

        isFeatured: {
            type: Boolean,
            default: false
        },

        preparationTime: {
            type: Number,
            required: true,
            min: 1
        },

        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },

        totalReviews: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    {
        timestamps: true
    }
);

const foodModel = mongoose.model("Food", foodSchema);

module.exports = foodModel;