const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
            unique: true
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        method: {
            type: String,
            enum: ["cash", "upi"],
            required: true
        },

        status: {
            type: String,
            enum: [
                "pending",
                "processing",
                "paid",
                "failed",
                "cancelled",
                "refunded"
            ],
            default: "pending"
        },

        transactionId: {
            type: String,
            trim: true,
            default: null
        },

        provider: {
            type: String,
            enum: [
                "cash",
                "upi",
                "other"
            ],
            default: null
        },

        paidAt: {
            type: Date,
            default: null
        },

        verifiedAt: {
            type: Date,
            default: null
        },

        verifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        customerNote: {
            type: String,
            trim: true,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

const paymentModel = mongoose.model("Payment", paymentSchema);

module.exports = paymentModel;