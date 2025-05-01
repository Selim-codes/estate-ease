const express = require('express');
const multer = require('multer');
const { createPropertyController } = require('../controllers/propertyController');
const {getAllProperty} = require("../controllers/propertycontroller");
const upload = multer();

const router = express.Router();


router.post('/add-properties', upload.single('image'), createPropertyController);
router.get('/get-properties', getAllProperty);

module.exports = router;