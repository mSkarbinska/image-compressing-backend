const express = require('express');
const router = express.Router();

const imageController = require('../controllers/imageController');


// router.get('/', imageController.getImages);
router.get('/compress', imageController.compressImage);
// router.get('/:id', imageController.getImageById);


module.exports = router;