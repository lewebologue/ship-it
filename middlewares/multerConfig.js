const multer = require('multer');

const mimeTypes = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/gif': 'gif'
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        const name = file.originalname.split(' ').join('_');
        const extension = mimeTypes[file.mimetype];
        cb(null, `${name}_${Date.now()}.${extension}`);
    }
});

module.exports = multer({storage: storage}).single('image');