const multer = require('multer');
const storage = multer.memoryStorage();

const fileFilter = (req, file, callback) => {
    if ((file.mimetype && file.mimetype === 'image/jpg') ||  (file.mimetype.startsWith("image/")){
        cb(null, true);
    } else {
        callback(new Error('only images are allowed'));
    }
};

const upload = multer({ storage,
fileFilter,limits:{fileSize: 5 * 1024 * 1024}});

module.exports = upload;