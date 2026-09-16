const mongoose = require("mongoose");
const foodModel = require("../models/foodModel");


// ==========================================
// CREATE FOOD
// ==========================================

const createFood = async (req, res) => {

    try {

        const {
            category,
            name,
            description,
            images,
            price,
            discountPrice,
            foodType,
            isAvailable,
            isFeatured,
            preparationTime
        } = req.body;


        // Required fields
        if (
            !category ||
            !name ||
            !description ||
            !price ||
            !foodType ||
            !preparationTime
        ) {

            return res.status(400).json({
                success: false,
                message: "Required fields are missing"
            });

        }


        const food = await foodModel.create({

            category,

            name,

            description,

            images: images || [],

            price,

            discountPrice:
                discountPrice || 0,

            foodType,

            isAvailable:
                isAvailable !== undefined
                    ? isAvailable
                    : true,

            isFeatured:
                isFeatured !== undefined
                    ? isFeatured
                    : false,

            preparationTime

        });


        return res.status(201).json({

            success: true,

            message: "Food created successfully",

            food

        });

    } catch (error) {

        console.error(
            "Create Food Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message: "Failed to create food",

            error: error.message

        });

    }
};


// ==========================================
// GET ALL FOOD
// ==========================================

const getAllFood = async (req, res) => {

    try {

        const foods = await foodModel
            .find()
            .sort({
                createdAt: -1
            });


        return res.status(200).json({

            success: true,

            message: "Foods fetched successfully",

            count: foods.length,

            foods

        });

    } catch (error) {

        console.error(
            "Get All Food Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message: "Failed to fetch foods",

            error: error.message

        });

    }
};


// ==========================================
// GET FOOD BY ID
// ==========================================

const getFoodById = async (req, res) => {

    try {

        const { id } = req.params;


        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {

            return res.status(400).json({

                success: false,

                message: "Invalid food ID"

            });

        }


        const food =
            await foodModel.findById(id);


        if (!food) {

            return res.status(404).json({

                success: false,

                message: "Food not found"

            });

        }


        return res.status(200).json({

            success: true,

            message: "Food fetched successfully",

            food

        });

    } catch (error) {

        console.error(
            "Get Food By ID Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message: "Failed to fetch food",

            error: error.message

        });

    }
};


// ==========================================
// UPDATE FOOD
// ==========================================

const updateFood = async (req, res) => {

    try {

        const { id } = req.params;


        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {

            return res.status(400).json({

                success: false,

                message: "Invalid food ID"

            });

        }


        const food =
            await foodModel.findByIdAndUpdate(

                id,

                req.body,

                {
                    new: true,
                    runValidators: true
                }

            );


        if (!food) {

            return res.status(404).json({

                success: false,

                message: "Food not found"

            });

        }


        return res.status(200).json({

            success: true,

            message: "Food updated successfully",

            food

        });

    } catch (error) {

        console.error(
            "Update Food Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message: "Failed to update food",

            error: error.message

        });

    }
};


// ==========================================
// DELETE FOOD
// ==========================================

const deleteFood = async (req, res) => {

    try {

        const { id } = req.params;


        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {

            return res.status(400).json({

                success: false,

                message: "Invalid food ID"

            });

        }


        const food =
            await foodModel.findByIdAndDelete(id);


        if (!food) {

            return res.status(404).json({

                success: false,

                message: "Food not found"

            });

        }


        return res.status(200).json({

            success: true,

            message: "Food deleted successfully"

        });

    } catch (error) {

        console.error(
            "Delete Food Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message: "Failed to delete food",

            error: error.message

        });

    }
};


// ==========================================
// EXPORT
// ==========================================

module.exports = {

    createFood,

    getAllFood,

    getFoodById,

    updateFood,

    deleteFood

};