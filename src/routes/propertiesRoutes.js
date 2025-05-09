const express = require("express");
const multer = require("multer");
const upload = multer();
const { protect, authorize } = require("../middleware/auth");
const router = express.Router();

const {
  createPropertyController,
  getAllProperty,
  deletePropertyById,
  filterProperty,
  updatePropertyById,
  getPropertybyid,
  getMyProperties,
} = require("../controllers/propertycontroller");

// Create property (with image upload)
router.post(
  "/add-properties",
  upload.single("image"),
  protect,
  authorize("admin", "agent"),
  createPropertyController
);

// Create property
router.post(
  "/properties",
  protect, // Ensure the user is authenticated
  authorize("admin", "agent"), // Ensure only admins or agents can create properties
  createPropertyController
);

// Get all properties
router.get("/get-properties", getAllProperty);

// Get property by ID
router.get("/get-properties/:id", getPropertybyid);

//Get property by Filter
router.get("/filter", filterProperty);

// Get properties by user
router.get("/properties/my", protect, getMyProperties);

// Update property by ID
router.put(
  "/update-properties/:id",
  upload.single("image"),
  protect,
  authorize("admin", "agent"),
  updatePropertyById
);

// Delete property by ID
router.delete(
  "/delete-properties/:id",
  protect,
  authorize("admin", "agent"),
  deletePropertyById
);

module.exports = router;
