const { Property } = require('../models');
const { uploadToS3 } = require('../utils/s3Uploader');

async function createPropertyService(file, body, user) {
    let imageUrl = null;

    if (process.env.NODE_ENV === 'production' && file) {
        imageUrl = await uploadToS3(file);
    }

    const newProperty = await Property.create({
        ...body,
        ...(imageUrl && { imageurl: imageUrl }),
        userId: user.id
    });

    return newProperty;
}

module.exports = {
    createPropertyService,
};