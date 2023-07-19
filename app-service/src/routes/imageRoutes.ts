import * as express from 'express'
// @ts-ignore
import multer from 'multer'
import * as imageController from '../controllers/imageController'

export const imageRouter = express.Router()

const upload = multer({ storage: multer.memoryStorage() })

imageRouter.get('/', imageController.getImages)
imageRouter.post('/upload', upload.single('image'), imageController.uploadImage)
imageRouter.get('/:id', imageController.getImageById)
