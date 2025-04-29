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
    description: {
        type: DataTypes.TEXT
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false
    },
    zipCode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    bedrooms: {
        type: DataTypes.INTEGER
    },
    bathrooms: {
        type: DataTypes.FLOAT
    },
    squareFeet: {
        type: DataTypes.INTEGER
    },
    propertyType: {
        type: DataTypes.ENUM('apartment', 'house', 'condo', 'land', 'commercial'),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('available', 'pending', 'sold'),
        defaultValue: 'available'
    },
    imageurl:{
        type:DataTypes.STRING,
        allowNull: true
    },
    featured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

module.exports = Property;