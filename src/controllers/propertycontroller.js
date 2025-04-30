const db = require('../db/config');
const {Property} = require("../models");
const propertyController = db.Property;
const uploadpics = require('../utils/s3Uploader')
dotenv.config();

async function getAllProperty(req, res){
    try{
        const properties = await Property.findAll();
        return res.status(200).json(properties);
    } catch(err){
        return res.status(400).json({message:err.message});
    }
}

async function createProperty(req, res, uploadpics) {
    try {
        let imageUrl = null;

        // Only attempt image upload in production
        if (process.env.NODE_ENV === 'production' && req.file) {
            imageUrl = await uploadpics(req.file);
        }

        const newProperty = await Property.create({
            ...req.body,
            ...(imageUrl && { imageUrl }), // Only include imageUrl if it's set
        });

        return res.status(201).json({
            message: 'Property created successfully',
            data: newProperty,
        });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}