    const multer = require('multer'); 

    const storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, './public/imgs/userImages/');
        },
        filename: function(req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname); 
        }
    });

    const upload = multer({ storage: storage }).single('profileImage');

    module.exports = {
        multer,
        upload
    }