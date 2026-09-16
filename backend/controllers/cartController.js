const mongoose = require("mongoose");

const Cart = require("../models/cartModel");
const Food = require("../models/foodModel");


// =====================================================
// GET FOOD PRICE
// =====================================================

const getFoodPrice = (food) => {

    if (
        food.discountPrice !== null &&
        food.discountPrice !== undefined &&
        Number(food.discountPrice) > 0 &&
        Number(food.discountPrice) < Number(food.price)
    ) {
        return Number(food.discountPrice);
    }

    return Number(food.price);
};


// =====================================================
// CALCULATE CART TOTALS
// =====================================================

const calculateCartTotals = (cart) => {

    let subtotal = 0;


    cart.items.forEach((item) => {

        item.quantity = Number(item.quantity);

        item.price = Number(item.price);

        item.total =
            item.price * item.quantity;

        subtotal += item.total;

    });


    cart.subtotal = subtotal;

    // No coupon/discount system currently
    cart.discount = 0;

    // Delivery fee
    cart.deliveryFee =
        subtotal > 0 ? 40 : 0;

    // Final total
    cart.total =
        cart.subtotal -
        cart.discount +
        cart.deliveryFee;


    return cart;
};


// =====================================================
// POPULATE CART
// =====================================================

const getPopulatedCart = async (cartId) => {

    const cart = await Cart
        .findById(cartId)
        .populate({
            path: "items.food",
            select:
                "name description price discountPrice images foodType isAvailable preparationTime rating totalReviews"
        });

    return cart;
};


// =====================================================
// ADD TO CART
// =====================================================

const addToCart = async (req, res) => {

    try {

        // ==========================================
        // AUTHENTICATION
        // ==========================================

        if (!req.user || !req.user._id) {

            return res.status(401).json({
                success: false,
                message:
                    "User authentication required."
            });

        }


        const userId = req.user._id;


        // ==========================================
        // REQUEST BODY
        // ==========================================

        const { foodId } = req.body;

        const quantity =
            Number(req.body.quantity ?? 1);


        


        // ==========================================
        // VALIDATE FOOD ID
        // ==========================================

        if (!foodId) {

            return res.status(400).json({
                success: false,
                message:
                    "Food ID is required."
            });

        }


        if (
            !mongoose.Types.ObjectId.isValid(
                foodId
            )
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid food ID."
            });

        }


        // ==========================================
        // VALIDATE QUANTITY
        // ==========================================

        if (
            !Number.isInteger(quantity) ||
            quantity < 1
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Quantity must be a whole number greater than 0."
            });

        }


        // ==========================================
        // FIND FOOD
        // ==========================================

        const food =
            await Food.findById(foodId);


        if (!food) {

            return res.status(404).json({
                success: false,
                message:
                    "Food not found."
            });

        }


        // ==========================================
        // CHECK AVAILABILITY
        // ==========================================

        if (!food.isAvailable) {

            return res.status(400).json({
                success: false,
                message:
                    "This food is currently unavailable."
            });

        }


        // ==========================================
        // GET CURRENT PRICE
        // ==========================================

        const foodPrice =
            getFoodPrice(food);


        // ==========================================
        // FIND USER CART
        // ==========================================

        let cart =
            await Cart.findOne({
                user: userId
            });


        // ==========================================
        // CREATE CART
        // ==========================================

        if (!cart) {

            cart = new Cart({
                user: userId,
                items: []
            });

        }


        // ==========================================
        // CHECK EXISTING ITEM
        // ==========================================

        const existingItem =
            cart.items.find(
                (item) =>
                    String(item.food) ===
                    String(foodId)
            );


        // ==========================================
        // EXISTING ITEM
        // ==========================================

        if (existingItem) {

            existingItem.quantity =
                Number(existingItem.quantity) +
                quantity;

            existingItem.price =
                foodPrice;

            existingItem.total =
                existingItem.price *
                existingItem.quantity;

        }


        // ==========================================
        // NEW ITEM
        // ==========================================

        else {

            cart.items.push({

                food: food._id,

                quantity,

                price: foodPrice,

                total:
                    foodPrice * quantity

            });

        }


        // ==========================================
        // CALCULATE TOTALS
        // ==========================================

        calculateCartTotals(cart);


        // ==========================================
        // SAVE CART
        // ==========================================

        await cart.save();


        // ==========================================
        // POPULATE CART
        // ==========================================

        const populatedCart =
            await getPopulatedCart(
                cart._id
            );


      


        // ==========================================
        // RESPONSE
        // ==========================================

        return res.status(200).json({

            success: true,

            message:
                "Item added to cart successfully.",

            cart: populatedCart

        });


    } catch (error) {

        console.error(
            "ADD TO CART ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Error adding item to cart.",

            error:
                error.message

        });

    }
};


// =====================================================
// GET CART
// =====================================================

const getCartItems = async (req, res) => {

    try {

        // ==========================================
        // AUTH
        // ==========================================

        if (!req.user || !req.user._id) {

            return res.status(401).json({

                success: false,

                message:
                    "User authentication required."

            });

        }


        const userId = req.user._id;


        // ==========================================
        // FIND CART
        // ==========================================

        let cart =
            await Cart.findOne({
                user: userId
            });


        // ==========================================
        // CART DOES NOT EXIST
        // ==========================================

        if (!cart) {

            return res.status(200).json({

                success: true,

                message:
                    "Cart is empty.",

                cart: {

                    items: [],

                    subtotal: 0,

                    discount: 0,

                    deliveryFee: 0,

                    total: 0

                }

            });

        }


        // ==========================================
        // RECALCULATE
        // ==========================================

        calculateCartTotals(cart);


        await cart.save();


        // ==========================================
        // POPULATE
        // ==========================================

        const populatedCart =
            await getPopulatedCart(
                cart._id
            );


       


        // ==========================================
        // RESPONSE
        // ==========================================

        return res.status(200).json({

            success: true,

            message:
                "Cart items fetched successfully.",

            cart: populatedCart

        });


    } catch (error) {

        console.error(
            "GET CART ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Error fetching cart items.",

            error:
                error.message

        });

    }
};


// =====================================================
// UPDATE CART ITEM
// =====================================================

const updateCartItem = async (req, res) => {

    try {

        // ==========================================
        // AUTH
        // ==========================================

        if (!req.user || !req.user._id) {

            return res.status(401).json({

                success: false,

                message:
                    "User authentication required."

            });

        }


        const userId = req.user._id;

        const { foodId } = req.params;

        const quantity =
            Number(req.body.quantity);


      


        // ==========================================
        // VALIDATE FOOD ID
        // ==========================================

        if (!foodId) {

            return res.status(400).json({

                success: false,

                message:
                    "Food ID is required."

            });

        }


        if (
            !mongoose.Types.ObjectId.isValid(
                foodId
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid food ID."

            });

        }


        // ==========================================
        // VALIDATE QUANTITY
        // ==========================================

        if (
            !Number.isInteger(quantity) ||
            quantity < 1
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Quantity must be a whole number greater than 0."

            });

        }


        // ==========================================
        // FIND CART
        // ==========================================

        const cart =
            await Cart.findOne({
                user: userId
            });


        if (!cart) {

            return res.status(404).json({

                success: false,

                message:
                    "Cart not found."

            });

        }


        // ==========================================
        // FIND ITEM
        // ==========================================

        const cartItem =
            cart.items.find(
                (item) =>
                    String(item.food) ===
                    String(foodId)
            );


        if (!cartItem) {

            return res.status(404).json({

                success: false,

                message:
                    "Food item not found in cart."

            });

        }


        // ==========================================
        // FIND FOOD
        // ==========================================

        const food =
            await Food.findById(foodId);


        if (!food) {

            return res.status(404).json({

                success: false,

                message:
                    "Food not found."

            });

        }


        // ==========================================
        // AVAILABILITY
        // ==========================================

        if (!food.isAvailable) {

            return res.status(400).json({

                success: false,

                message:
                    "This food is currently unavailable."

            });

        }


        // ==========================================
        // PRICE
        // ==========================================

        const foodPrice =
            getFoodPrice(food);


        // ==========================================
        // UPDATE ITEM
        // ==========================================

        cartItem.quantity =
            quantity;

        cartItem.price =
            foodPrice;

        cartItem.total =
            foodPrice * quantity;


        // ==========================================
        // TOTALS
        // ==========================================

        calculateCartTotals(cart);


        // ==========================================
        // SAVE
        // ==========================================

        await cart.save();


        // ==========================================
        // POPULATE
        // ==========================================

        const populatedCart =
            await getPopulatedCart(
                cart._id
            );


        // ==========================================
        // RESPONSE
        // ==========================================

        return res.status(200).json({

            success: true,

            message:
                "Cart item updated successfully.",

            cart: populatedCart

        });


    } catch (error) {

        console.error(
            "UPDATE CART ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Error updating cart item.",

            error:
                error.message

        });

    }
};


// =====================================================
// REMOVE FROM CART
// =====================================================

const removeFromCart = async (req, res) => {

    try {

        // ==========================================
        // AUTH
        // ==========================================

        if (!req.user || !req.user._id) {

            return res.status(401).json({

                success: false,

                message:
                    "User authentication required."

            });

        }


        const userId = req.user._id;

        const { foodId } = req.params;


     


        // ==========================================
        // VALIDATE FOOD ID
        // ==========================================

        if (!foodId) {

            return res.status(400).json({

                success: false,

                message:
                    "Food ID is required."

            });

        }


        if (
            !mongoose.Types.ObjectId.isValid(
                foodId
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid food ID."

            });

        }


        // ==========================================
        // FIND CART
        // ==========================================

        const cart =
            await Cart.findOne({
                user: userId
            });


        if (!cart) {

            return res.status(404).json({

                success: false,

                message:
                    "Cart not found."

            });

        }




        // ==========================================
        // FIND ITEM
        // ==========================================

        const itemExists =
            cart.items.some(
                (item) =>
                    String(item.food) ===
                    String(foodId)
            );


        if (!itemExists) {

            return res.status(404).json({

                success: false,

                message:
                    "Food item not found in cart."

            });

        }


        // ==========================================
        // REMOVE ITEM
        // ==========================================

        cart.items =
            cart.items.filter(
                (item) =>
                    String(item.food) !==
                    String(foodId)
            );


        // ==========================================
        // RECALCULATE
        // ==========================================

        calculateCartTotals(cart);


        // ==========================================
        // SAVE
        // ==========================================

        await cart.save();


        // ==========================================
        // POPULATE
        // ==========================================

        const populatedCart =
            await getPopulatedCart(
                cart._id
            );


        // ==========================================
        // RESPONSE
        // ==========================================

        return res.status(200).json({

            success: true,

            message:
                "Item removed from cart successfully.",

            cart: populatedCart

        });


    } catch (error) {

        console.error(
            "REMOVE CART ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Error removing item from cart.",

            error:
                error.message

        });

    }
};


// =====================================================
// CLEAR CART
// =====================================================

const clearCart = async (req, res) => {

    try {

        // ==========================================
        // AUTH
        // ==========================================

        if (!req.user || !req.user._id) {

            return res.status(401).json({

                success: false,

                message:
                    "User authentication required."

            });

        }


        const userId = req.user._id;


        // ==========================================
        // FIND CART
        // ==========================================

        const cart =
            await Cart.findOne({
                user: userId
            });


        if (!cart) {

            return res.status(200).json({

                success: true,

                message:
                    "Cart is already empty.",

                cart: {

                    items: [],

                    subtotal: 0,

                    discount: 0,

                    deliveryFee: 0,

                    total: 0

                }

            });

        }


        // ==========================================
        // CLEAR
        // ==========================================

        cart.items = [];

        cart.subtotal = 0;

        cart.discount = 0;

        cart.deliveryFee = 0;

        cart.total = 0;


        // ==========================================
        // SAVE
        // ==========================================

        await cart.save();


        // ==========================================
        // RESPONSE
        // ==========================================

        return res.status(200).json({

            success: true,

            message:
                "Cart cleared successfully.",

            cart

        });


    } catch (error) {

        console.error(
            "CLEAR CART ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Error clearing cart.",

            error:
                error.message

        });

    }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    addToCart,

    getCartItems,

    updateCartItem,

    removeFromCart,

    clearCart

};