import {sendMessageToQueue, QueueMessage} from '../utils/messageQueue'
import {isValidURL, uploadImageToCloudinary} from '../utils/helpers'
import {ImageMetadata} from '../models/ImageMetadata'
import {saveCompressingTask} from './taskService'
import {ImageMetadataResponse} from '../types/ImageMetadataResponse'

interface UploadImageResponse {
    imageUrl: string,
    taskId: string,
    imageId: string
}

export const uploadImage = async (imageFileBuffer: Buffer): Promise<UploadImageResponse> => {
    const imageUrl = await uploadImageToCloudinary(imageFileBuffer)

    isValidURL(imageUrl)

    const imageId = await saveImageMetadataToDb(imageUrl)
    const taskId= await saveCompressingTask(imageId)

    const message: QueueMessage = {imageId: imageId.toString(), taskId: taskId.toString(), imageUrl}

    sendMessageToQueue(message)

    return new Promise((resolve) => {
        resolve({imageUrl, taskId, imageId} as UploadImageResponse)
    })
}

export const getImageById = async (id: string): Promise<ImageMetadataResponse | undefined> => {
    return await ImageMetadata.findById(id)
        .then(image => {
            if(image) {
                return {
                    id: image?._id.toString(),
                    imageUrl: image?.imageUrl,
                    compressedUrl: image?.compressedUrl,
                    createdAt: image?.createdAt.toString(),
                } as ImageMetadataResponse
            }else{
                return undefined
            }
        })
        .catch((error) => {
            throw new Error('Failed to get image from the database.' + error)
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

const saveImageMetadataToDb = async (imageUrl: string): Promise<string> => {
    try {
        const imageMetadata = new ImageMetadata({ imageUrl })
        return await imageMetadata.save().then(image => image._id.toString())
    } catch (error) {
        console.log(error)
        throw new Error('Failed to save image metadata to the database.')
    }
}