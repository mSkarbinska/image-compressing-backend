import {sendMessageToQueue, QueueMessage} from '../utils/messageQueue'
import {uploadImageToCloudinary} from '../utils/helpers'
import {ImageMetadata, saveImageMetadataToDb} from '../models/ImageMetadata'
import {saveCompressingTask} from './taskService'
import {ImageMetadataResponse} from '../types/ImageMetadataResponse'

interface UploadImageResponse {
    imageUrl: string,
    taskId: string,
    imageId: string
}

export const uploadImage = async (imageFileBuffer: Buffer): Promise<UploadImageResponse> => {
    const imageUrl = await uploadImageToCloudinary(imageFileBuffer)

    const imageId = await saveImageMetadataToDb(imageUrl)
    const {taskId} = await saveCompressingTask(imageId)

    const message: QueueMessage = {imageId: imageId?.toString(), taskId: taskId?.toString(), imageUrl}
    try {
        await sendMessageToQueue(message)

        return new Promise((resolve) => {
            resolve(message)
        })
    } catch (error) {
        console.log(error)
        throw new Error('Failed to send image compression task to the queue.')
    }
}

export const getImageById = async (id: string): Promise<ImageMetadataResponse> => {
    try {
        const result = await ImageMetadata.findById(id)
        if (!result) {
            throw new Error('Image not found.')
        }
        return new Promise((resolve) => {
            resolve({
                id: result._id.toString(),
                imageUrl: result.imageUrl,
                compressedUrl: result.compressedUrl,
                createdAt: result.createdAt.toString(),
            })
        })
    } catch (error) {
        console.log(error)
        throw new Error('Failed to get image metadata from the database.')
    }
}

export const getImages = async (): Promise<ImageMetadataResponse[]> => {
    try {
        return await ImageMetadata.find()
    } catch (error) {
        console.log(error)
        throw new Error('Failed to get images from the database.')
    }
}