const { uploadToS3 } = require('../utils/s3');
const Property = require('../models/Property'); // Adjust as per your ORM

async function createProperty(req) {
    let imageUrl = null;

    // Only attempt image upload in production
    if (process.env.NODE_ENV === 'production' && req.file) {
        imageUrl = await uploadToS3(req.file);
    }

    const newProperty = await Property.create({
        ...req.body,
        ...(imageUrl && { imageUrl }), // Only include imageUrl if it's set
    });

    return newProperty;
}

module.exports = { createProperty };