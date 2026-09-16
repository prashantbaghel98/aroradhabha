const mongoose = require("mongoose");
const Address = require("../models/addressModel");


// =====================================================
// Helper: Validate User
// =====================================================

const checkUser = (req, res) => {
    if (!req.user || !req.user._id) {
        res.status(401).json({
            success: false,
            message: "User authentication required."
        });

        return false;
    }

    return true;
};


// =====================================================
// Helper: Validate Address ID
// =====================================================

const validateAddressId = (addressId, res) => {
    if (!addressId) {
        res.status(400).json({
            success: false,
            message: "Address ID is required."
        });

        return false;
    }

    if (!mongoose.Types.ObjectId.isValid(addressId)) {
        res.status(400).json({
            success: false,
            message: "Invalid address ID."
        });

        return false;
    }

    return true;
};


// =====================================================
// ADD ADDRESS
// =====================================================

const addAddress = async (req, res) => {
    try {

        // -------------------------------------------------
        // Check authentication
        // -------------------------------------------------

        if (!checkUser(req, res)) {
            return;
        }

        const userId = req.user._id;

        // -------------------------------------------------
        // Get data
        // -------------------------------------------------

        const {
            name,
            phone,
            addressLine1,
            addressLine2,
            landmark,
            city,
            state,
            pincode,
            addressType,
            isDefault
        } = req.body;


        // -------------------------------------------------
        // Validate required fields
        // -------------------------------------------------

        if (
            !name ||
            !phone ||
            !addressLine1 ||
            !city ||
            !state ||
            !pincode
        ) {
            return res.status(400).json({
                success: false,
                message: "Name, phone, address, city, state and pincode are required."
            });
        }


        // -------------------------------------------------
        // Validate address type
        // -------------------------------------------------

        if (
            addressType &&
            !["home", "work", "other"].includes(addressType)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid address type."
            });
        }


        // -------------------------------------------------
        // Check whether user already has addresses
        // -------------------------------------------------

        const addressCount = await Address.countDocuments({
            user: userId
        });


        // -------------------------------------------------
        // First address automatically becomes default
        // -------------------------------------------------

        let makeDefault = Boolean(isDefault);

        if (addressCount === 0) {
            makeDefault = true;
        }


        // -------------------------------------------------
        // If this address is default,
        // remove default from old addresses
        // -------------------------------------------------

        if (makeDefault) {
            await Address.updateMany(
                { user: userId },
                { $set: { isDefault: false } }
            );
        }


        // -------------------------------------------------
        // Create address
        // -------------------------------------------------

        const address = await Address.create({
            user: userId,
            name: name.trim(),
            phone,
            addressLine1: addressLine1.trim(),
            addressLine2: addressLine2
                ? addressLine2.trim()
                : "",
            landmark: landmark
                ? landmark.trim()
                : "",
            city: city.trim(),
            state: state.trim(),
            pincode,
            addressType: addressType || "home",
            isDefault: makeDefault
        });


        // -------------------------------------------------
        // Response
        // -------------------------------------------------

        return res.status(201).json({
            success: true,
            message: "Address added successfully.",
            data: address
        });

    } catch (error) {

        console.error("Add address error:", error);

        return res.status(500).json({
            success: false,
            message: "Error adding address.",
            error: error.message
        });
    }
};


// =====================================================
// GET ALL ADDRESSES
// =====================================================

const getAddresses = async (req, res) => {
    try {

        // -------------------------------------------------
        // Check authentication
        // -------------------------------------------------

        if (!checkUser(req, res)) {
            return;
        }

        const userId = req.user._id;


        // -------------------------------------------------
        // Get user's addresses
        // -------------------------------------------------

        const addresses = await Address.find({
            user: userId
        }).sort({
            isDefault: -1,
            createdAt: -1
        });


        // -------------------------------------------------
        // Response
        // -------------------------------------------------

        return res.status(200).json({
            success: true,
            message: "Addresses fetched successfully.",
            count: addresses.length,
            data: addresses
        });

    } catch (error) {

        console.error("Get addresses error:", error);

        return res.status(500).json({
            success: false,
            message: "Error fetching addresses.",
            error: error.message
        });
    }
};


// =====================================================
// GET SINGLE ADDRESS
// =====================================================

const getAddress = async (req, res) => {
    try {

        // -------------------------------------------------
        // Check authentication
        // -------------------------------------------------

        if (!checkUser(req, res)) {
            return;
        }

        const userId = req.user._id;

        const { id } = req.params;


        // -------------------------------------------------
        // Validate address ID
        // -------------------------------------------------

        if (!validateAddressId(id, res)) {
            return;
        }


        // -------------------------------------------------
        // Find address
        // -------------------------------------------------

        const address = await Address.findOne({
            _id: id,
            user: userId
        });


        // -------------------------------------------------
        // Address not found
        // -------------------------------------------------

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found."
            });
        }


        // -------------------------------------------------
        // Response
        // -------------------------------------------------

        return res.status(200).json({
            success: true,
            message: "Address fetched successfully.",
            data: address
        });

    } catch (error) {

        console.error("Get address error:", error);

        return res.status(500).json({
            success: false,
            message: "Error fetching address.",
            error: error.message
        });
    }
};


// =====================================================
// UPDATE ADDRESS
// =====================================================

const updateAddress = async (req, res) => {
    try {

        // -------------------------------------------------
        // Check authentication
        // -------------------------------------------------

        if (!checkUser(req, res)) {
            return;
        }

        const userId = req.user._id;

        const { id } = req.params;


        // -------------------------------------------------
        // Validate address ID
        // -------------------------------------------------

        if (!validateAddressId(id, res)) {
            return;
        }


        // -------------------------------------------------
        // Get data
        // -------------------------------------------------

        const {
            name,
            phone,
            addressLine1,
            addressLine2,
            landmark,
            city,
            state,
            pincode,
            addressType,
            isDefault
        } = req.body;


        // -------------------------------------------------
        // Find user's address
        // -------------------------------------------------

        const address = await Address.findOne({
            _id: id,
            user: userId
        });


        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found."
            });
        }


        // -------------------------------------------------
        // Validate address type
        // -------------------------------------------------

        if (
            addressType &&
            !["home", "work", "other"].includes(addressType)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid address type."
            });
        }


        // -------------------------------------------------
        // Update fields
        // -------------------------------------------------

        if (name !== undefined) {
            address.name = name.trim();
        }

        if (phone !== undefined) {
            address.phone = phone;
        }

        if (addressLine1 !== undefined) {
            address.addressLine1 = addressLine1.trim();
        }

        if (addressLine2 !== undefined) {
            address.addressLine2 = addressLine2.trim();
        }

        if (landmark !== undefined) {
            address.landmark = landmark.trim();
        }

        if (city !== undefined) {
            address.city = city.trim();
        }

        if (state !== undefined) {
            address.state = state.trim();
        }

        if (pincode !== undefined) {
            address.pincode = pincode;
        }

        if (addressType !== undefined) {
            address.addressType = addressType;
        }


        // -------------------------------------------------
        // Handle default address
        // -------------------------------------------------

        if (isDefault === true) {

            await Address.updateMany(
                {
                    user: userId,
                    _id: { $ne: id }
                },
                {
                    $set: {
                        isDefault: false
                    }
                }
            );

            address.isDefault = true;
        }


        // -------------------------------------------------
        // Save
        // -------------------------------------------------

        await address.save();


        // -------------------------------------------------
        // Response
        // -------------------------------------------------

        return res.status(200).json({
            success: true,
            message: "Address updated successfully.",
            data: address
        });

    } catch (error) {

        console.error("Update address error:", error);

        return res.status(500).json({
            success: false,
            message: "Error updating address.",
            error: error.message
        });
    }
};


// =====================================================
// DELETE ADDRESS
// =====================================================

const deleteAddress = async (req, res) => {
    try {

        // -------------------------------------------------
        // Check authentication
        // -------------------------------------------------

        if (!checkUser(req, res)) {
            return;
        }

        const userId = req.user._id;

        const { id } = req.params;


        // -------------------------------------------------
        // Validate address ID
        // -------------------------------------------------

        if (!validateAddressId(id, res)) {
            return;
        }


        // -------------------------------------------------
        // Find user's address
        // -------------------------------------------------

        const address = await Address.findOne({
            _id: id,
            user: userId
        });


        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found."
            });
        }


        const wasDefault = address.isDefault;


        // -------------------------------------------------
        // Delete address
        // -------------------------------------------------

        await Address.deleteOne({
            _id: id,
            user: userId
        });


        // -------------------------------------------------
        // If deleted address was default,
        // make another address default
        // -------------------------------------------------

        if (wasDefault) {

            const nextAddress = await Address.findOne({
                user: userId
            }).sort({
                createdAt: -1
            });


            if (nextAddress) {

                nextAddress.isDefault = true;

                await nextAddress.save();
            }
        }


        // -------------------------------------------------
        // Response
        // -------------------------------------------------

        return res.status(200).json({
            success: true,
            message: "Address deleted successfully."
        });

    } catch (error) {

        console.error("Delete address error:", error);

        return res.status(500).json({
            success: false,
            message: "Error deleting address.",
            error: error.message
        });
    }
};


// =====================================================
// SET DEFAULT ADDRESS
// =====================================================

const setDefaultAddress = async (req, res) => {
    try {

        // -------------------------------------------------
        // Check authentication
        // -------------------------------------------------

        if (!checkUser(req, res)) {
            return;
        }

        const userId = req.user._id;

        const { id } = req.params;


        // -------------------------------------------------
        // Validate address ID
        // -------------------------------------------------

        if (!validateAddressId(id, res)) {
            return;
        }


        // -------------------------------------------------
        // Find address
        // -------------------------------------------------

        const address = await Address.findOne({
            _id: id,
            user: userId
        });


        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found."
            });
        }


        // -------------------------------------------------
        // Remove default from all user's addresses
        // -------------------------------------------------

        await Address.updateMany(
            {
                user: userId
            },
            {
                $set: {
                    isDefault: false
                }
            }
        );


        // -------------------------------------------------
        // Set selected address as default
        // -------------------------------------------------

        address.isDefault = true;

        await address.save();


        // -------------------------------------------------
        // Response
        // -------------------------------------------------

        return res.status(200).json({
            success: true,
            message: "Default address updated successfully.",
            data: address
        });

    } catch (error) {

        console.error("Set default address error:", error);

        return res.status(500).json({
            success: false,
            message: "Error setting default address.",
            error: error.message
        });
    }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
    addAddress,
    getAddresses,
    getAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
};