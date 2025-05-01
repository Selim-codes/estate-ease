const { uploadToS3 } = require('../utils/s3');
const Property = require('../models/Property');

async function createProperty(req) {
    let imageUrl = null;


    if (process.env.NODE_ENV === 'production' && req.file) {
        imageUrl = await uploadToS3(req.file);
    }

    const newProperty = await Property.create({
        ...req.body,
        ...(imageUrl && { imageUrl }),
    });

    return newProperty;
}

module.exports = { createProperty };