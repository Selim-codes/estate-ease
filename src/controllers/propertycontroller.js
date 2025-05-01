const db = require('../db/config');
const {Property} = require("../models");
const propertyController = db.Property;
const uploadpics = require('../utils/s3Uploader')
require('dotenv').config();
const { createProperty } = require('../services/propertyService');


async function getAllProperty(req, res){
    try{
        const properties = await Property.findAll();
        return res.status(200).json(properties);
    } catch(err){
        return res.status(400).json({message:err.message});
    }
}


async function createPropertyController(req, res) {
    try {
        const newProperty = await createProperty(req);

        return res.status(201).json({
            message: 'Property created successfully',
            data: newProperty,
        });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

async function getPropertybyid(req, res){
    try{
        const property = await Property.findByPk(req.params.id);
        if (!property)  = return res.status(404).json({message:'Property Not Found'});
        res.status(200).json(property);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

async function updatePropertyById(req, res) {
    try {
        const property = await Property.findByPk(req.params.id);
        if (!property) return res.status(404).json({ message: 'Property not found' });

        await property.update(req.body);
        res.status(200).json({ message: 'Property updated', data: property });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
async function deletePropertyById(req, res) {
    try {
        const property = await Property.findByPk(req.params.id);
        if (!property) return res.status(404).json({ message: 'Property not found' });

        await property.destroy();
        res.status(200).json({ message: 'Property deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}





module.exports = { createPropertyController ,
    getAllProperty,
    deletePropertyById,
    updatePropertyById ,
    getPropertybyid};



