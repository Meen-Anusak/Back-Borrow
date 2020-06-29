const multer = require("multer");

module.exports = MulterConfig = {
    configs_user: {
        storage: multer.diskStorage({
            destination: function(req, file, cb) {
                cb(null, 'public/images/')
            },
            filename: function(req, file, cb) {
                const ext = file.mimetype.split('/')[1];
                cb(null, file.fieldname + '-' + Date.now() + '.' + ext)
            }
        }),
        limits: { fileSize: 1024 * 1024 * 5 },

        fileFilter: (req, file, cb) => {
            const image = file.mimetype.startsWith('image/');
            if (image) {
                cb(null, true)
            } else {
                cb({ message: 'file type not support' }, false)
            }
        }
    },
    configs_product: {
        storage: multer.diskStorage({
            destination: function(req, file, cb) {
                cb(null, 'public/images/product/')
            },
            filename: function(req, file, cb) {
                const ext = file.mimetype.split('/')[1];
                cb(null, file.fieldname + '-' + Date.now() + '.' + ext)
            }
        }),
        limits: { fileSize: 1024 * 1024 * 5 },

        fileFilter: (req, file, cb) => {
            const image = file.mimetype.startsWith('image/');
            if (image) {
                cb(null, true)
            } else {
                cb({ message: 'file type not support' }, false)
            }
        }
    },
    keyUploads: 'image'
}