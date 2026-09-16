const express = require("express");

const {addAddress,getAddresses,getAddress,updateAddress,deleteAddress,setDefaultAddress} = require("../controllers/addressController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// =====================================================
// ADDRESS ROUTES
// =====================================================

// Add address
router.post( "/add-address", authMiddleware,addAddress);


// Get all addresses
router.get("/get-addresses",authMiddleware,getAddresses
);


// Get single address
router.get( "/get-address/:id", authMiddleware,getAddress
);


// Update address
router.put( "/update-address/:id", authMiddleware,updateAddress
);


// Delete address
router.delete("/delete-address/:id",authMiddleware, deleteAddress
);


// Set default address
router.put( "/set-default/:id",authMiddleware,setDefaultAddress
);


module.exports = router;