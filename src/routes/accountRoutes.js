const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const accountValidation = require('../validation/accountValidation');
const validate = require('../validation/validate');
const passportValidate = require('../authorization/auth');
const multer = require('multer');
const path = require('path');
const imageStorage = multer.diskStorage({
    // Destination to store image     
    destination: 'images',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() +
                path.extname(file.originalname))
            // file.fieldname is name of the field (image)
            // path.extname get the uploaded file extension
    }
});

const imageUpload = multer({
    storage: imageStorage,
    limits: {
        fileSize: 1000000 // 1000000 Bytes = 1 MB
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg)$/)) {
            // upload only png and jpg format
            return cb(new Error('Please upload a Image'))
        }
        cb(undefined, true)
    }
})

router.route('/addUser').post(validate(accountValidation.addUserAccount), accountController.addUser);
router.route('/settings').post(passportValidate, validate(accountValidation.editProfileAccount), imageUpload.single('profile'), accountController.editProfile);
router.route('/login').post(validate(accountValidation.login), accountController.login);
router.route('/logout').post(passportValidate, accountController.logout);

module.exports = router;