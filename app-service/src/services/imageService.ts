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
    const taskId= await saveCompressingTask(imageId)

    const message: QueueMessage = {imageId: imageId.toString(), taskId: taskId.toString(), imageUrl}

    sendMessageToQueue(message)

    return new Promise((resolve) => {
        resolve({imageUrl, taskId, imageId} as UploadImageResponse)
    })
}

export const getImageById = async (id: string): Promise<ImageMetadataResponse> => {
    return await ImageMetadata.findById(id)
        .then(image => {
            return {
                id: image?._id.toString(),
                imageUrl: image?.imageUrl,
                compressedUrl: image?.compressedUrl,
                createdAt: image?.createdAt.toString(),
            } as ImageMetadataResponse
        })
        .catch((error) => {
            console.log(error)
            throw new Error('Failed to get image metadata from the database.')
        })
}

export const getImages = async (): Promise<ImageMetadataResponse[]> => {
    return await ImageMetadata.find()
        .then(images => {
            return images.map(image => {
                return {
                    id: image?._id.toString(),
                    imageUrl: image.imageUrl,
                    compressedUrl: image.compressedUrl,
                    createdAt: image.createdAt.toString(),
                } as ImageMetadataResponse
            })
        })
        .catch((error) => {
            console.log(error)
            throw new Error('Failed to get images from the database.')
        })
}