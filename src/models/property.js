const { DataTypes } = require("sequelize");
const sequelize = require("../db/config");

const Property = sequelize.define(
  "Property",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bedrooms: {
      //TODO : set it back to false when its time for deployment for beds and baths modify
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    bathrooms: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    propertyType: {
      type: DataTypes.ENUM("apartment", "house", "land"),
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // Default to false
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Property;
