const express = require('express');
const multer = require('multer');

const router = express.Router();

const imageController = require('../controllers/imageController');

const upload = multer({ storage: multer.memoryStorage() });

// router.get('/', imageController.getImages);
router.post('/upload', upload.single('image'), imageController.uploadImage);
// router.get('/:id', imageController.getImageById);
// router.get('/task/:id', imageController.getImageByTaskId);


module.exports = router;