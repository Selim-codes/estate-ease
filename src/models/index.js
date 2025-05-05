const sequelize = require('../db/config');
const User = require('./User');
const Property = require('./Property');


User.hasMany(Property, { as: 'properties', foreignKey: 'userId' });
Property.belongsTo(User, { as: 'owner', foreignKey: 'userId' });


module.exports = {
    sequelize,
    User,
    Property
};