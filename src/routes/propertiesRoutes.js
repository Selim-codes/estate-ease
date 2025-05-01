const express = require('express');
const multer = require('multer');
const upload = multer();
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

const {
    createPropertyController,
    getAllProperty,
    deletePropertyById,
    updatePropertyById,
    getPropertybyid
} = require("../controllers/propertyController");


// Create property (with image upload)
router.post(
    '/add-properties',
    upload.single('image'),
    protect,
    authorize('admin', 'agent'),
    createPropertyController
);

// Get all properties
router.get('/get-properties', getAllProperty);

// Get property by ID
router.get('/get-properties/:id', getPropertybyid);

// Update property by ID
router.put(
    '/update-properties/:id',
    upload.single('image'),
    protect,
    authorize('admin', 'agent'),
    updatePropertyById
);

// Delete property by ID
router.delete(
    '/delete-properties/:id',
    protect,
    authorize('admin', 'agent'),
    deletePropertyById
);

module.exports = router;