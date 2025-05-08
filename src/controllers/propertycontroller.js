const db = require("../db/config");
const { Property, User } = require("../models");
const propertyController = db.Property;
const uploadpics = require("../utils/s3Uploader");
require("dotenv").config();
const { createPropertyService } = require("../services/propertyService");

async function getAllProperty(req, res) {
  try {
    const properties = await Property.findAll({
      include: [
        { model: User, as: "owner", attributes: ["id", "name", "email"] },
      ],
    });
    return res.status(200).json(properties);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

async function createPropertyController(req, res) {
  try {
    const {
      title,
      description,
      price,
      bedrooms,
      bathrooms,
      address,
      city,
      zipCode,
      propertyType,
      status,
      imageUrl,
      featured,
    } = req.body;

    const property = await Property.create({
      title,
      description,
      price,
      bedrooms,
      bathrooms,
      address,
      city,
      zipCode,
      propertyType,
      status,
      imageUrl,
      featured,
      userId: req.user.id, // Associate the property with the logged-in user
    });

    res.status(201).json({
      message: "Property created successfully",
      property,
    });
  } catch (err) {
    console.error("Error creating property:", err);
    res.status(400).json({ message: "Failed to create property" });
  }
}

async function getPropertybyid(req, res) {
  try {
    const property = await Property.findByPk(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Property Not Found" });
    }
    res.status(200).json(property);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

const updatePropertyById = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findByPk(id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Ownership/Role check
    if (req.user.role !== "admin" && property.userId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this property" });
    }

    await property.update(req.body);
    res.status(200).json({
      message: "Property updated successfully",
      data: property,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

async function deletePropertyById(req, res) {
  try {
    const { id } = req.params;

    const property = await Property.findByPk(id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Ownership check: only allow if admin or creator
    if (req.user.role !== "admin" && req.user.id !== property.userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this property" });
    }

    await property.destroy();
    res.status(200).json({ message: "Property deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function filterProperty(req, res) {
  const { type, minPrice, maxPrice, minBeds, minBaths } = req.params;

  const where = {};
  if (type) where.type = type;
  if (minPrice) where.minPrice = minPrice;
  if (maxPrice) where.maxPrice = maxPrice;
  if (minBeds) where.minBeds = minBeds;

  try {
    const property = await Property.findAll({ where });
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getmyproperty(req, res) {
  const user = req.userId;
  if (!user) {
    return res.status(404).json({ message: "No properties found !!" });
  }
  try {
    const property = await Property.findAll(user.id);
    res.status(200).json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  createPropertyController,
  getAllProperty,
  deletePropertyById,
  updatePropertyById,
  filterProperty,
  getmyproperty,
  getPropertybyid,
};
