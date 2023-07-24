import * as express from 'express'
import * as ImageService from '../services/imageService'
import {logger} from '../utils/logger'


export const uploadImage = async (req: express.Request, res: express.Response) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' })
    }

    logger.info('Image upload request received')

    try {
        const imageFileBuffer = req.file?.buffer

        const result = await ImageService.uploadImage(imageFileBuffer)

        logger.info(`Image upload successful. Task ID: ${result.taskId} Image ID: ${result.imageId}`)

        return res.status(200).send({ taskId: result.taskId })
    } catch (error) {
        logger.error('Image upload failed', error)
        return res.status(500).send({ error: 'Image compression failed.' })
    }
  }

export const getImageById = async (req: express.Request, res: express.Response) => {
    const { id } = req.params

    logger.info(`Image metadata request received for image ID: ${id}`)

    try {
        const imageMetadata = await ImageService.getImageById(id)
        if(!imageMetadata){
            logger.warn(`Image metadata not found for image ID: ${id}`)
            return res.status(404).send({ error: 'Image not found.' })
        }
        return res.status(200).send(imageMetadata)
    } catch (error) {
        logger.error(`Image metadata request failed for image ID: ${id}`, error)
        return res.status(500).send({ error: 'Failed to get image metadata.' })
    }
}

export const getImages = async (req: express.Request, res: express.Response) => {
    logger.info('Image list request received')
    try {
        const images = await ImageService.getImages()
        logger.info('Image list request successful')
        return res.status(200).send(images)
    } catch (error) {
        logger.error('Image list request failed', error)
        return res.status(500).send({ error: 'Failed to get images.' })
    }
}