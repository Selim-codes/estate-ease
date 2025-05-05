const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

const Property = sequelize.define('Property', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    propertyType: {
        type: DataTypes.ENUM('apartment', 'house', 'land'),
        allowNull: false
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = Property;