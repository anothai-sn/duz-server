const multer = require('multer');
const path = require('path');

// Set up storage for Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/'); // Folder to save the images
    },
    filename: function (req, file, cb) {
       // Use the original file name instead of timestamp
       cb(null, file.originalname); // Retain the original name of the file
    }
});

// File filter to allow only image types
const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (extname && mimeType) {
        cb(null, true);
    } else {
        cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
};

// Create upload instance with file limit and file filter
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // limit 5MB per image
    fileFilter: fileFilter
});

module.exports = upload;
