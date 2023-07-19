import * as express from 'express'
import * as ImageService from '../services/imageService'


export const uploadImage = async (req: express.Request, res: express.Response) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' })
    }

    try {
        const imageFileBuffer = req.file?.buffer

        const result = await ImageService.uploadImage(imageFileBuffer)
        return res.status(200).send({ taskId: result.taskId })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ error: 'Image compression failed.' })
    }
  }

export const getImageById = async (req: express.Request, res: express.Response) => {
    const { id } = req.params

    try {
        const imageMetadata = await ImageService.getImageById(id)
        if(!imageMetadata){
            return res.status(404).send({ error: 'Image not found.' })
        }
        return res.status(200).send(imageMetadata)
    } catch (error) {
        console.log(error)
        return res.status(500).send({ error: 'Failed to get image metadata.' })
    }
}

export const getImages = async (req: express.Request, res: express.Response) => {
    try {
        const images = await ImageService.getImages()
        return res.status(200).send(images)
    } catch (error) {
        console.log(error)
        return res.status(500).send({ error: 'Failed to get images.' })
    }
}