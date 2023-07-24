import { connect} from '../../../setupTests'
import { uploadImage, getImageById } from '../imageService'
import {ObjectId} from 'mongodb'

beforeAll(async () => await connect())

jest.mock('../../utils/messageQueue', () => ({
    sendMessageToQueue: jest.fn(),
    QueueMessage: jest.fn(),
}))

jest.mock('../../utils/helpers', () => ({
    uploadImageToCloudinary: jest.fn((buffer: Buffer) => Promise.resolve('https://cloudinary.com/image.jpg')),
    isValidURL: jest.fn().mockImplementation((url: string) => true),
}))


describe('uploadImage', () => {
    it('should upload an image and return UploadImageResponse', async () => {
        const imageFileBuffer = Buffer.from('image_file_buffer')

        const response = await uploadImage(imageFileBuffer)

        expect(response).toBeDefined()
        expect(response.imageUrl).toEqual('https://cloudinary.com/image.jpg')
        expect(response.taskId).toBeDefined()
        expect(response.imageId).toBeDefined()
    })

    it('should throw an error if uploadImageToCloudinary fails', async () => {
        const imageFileBuffer = Buffer.from('image_file_buffer')
        jest.spyOn(require('../../utils/helpers'), 'uploadImageToCloudinary').mockImplementation(() => {
            throw new Error('Failed to upload image to cloudinary.')
        })

        await expect(uploadImage(imageFileBuffer)).rejects.toThrow('Failed to upload image to cloudinary.')
    })
})

describe('getImageById', () => {
    it('should get image metadata by ID and return ImageMetadataResponse', async () => {
        const imageId: string = '64b6617748277b450c613b15'
        jest.spyOn(require('../../models/ImageMetadata').ImageMetadata, 'findById').mockReturnValue(
            Promise.resolve({
                _id: new ObjectId(imageId),
                imageUrl: 'https://cloudinary.com/image.jpg',
                compressedUrl: 'https://cloudinary.com/compressed.jpg',
                createdAt: new Date()})
        )

        const response = await getImageById(imageId)

        expect(response).toBeDefined()
        expect(response.id).toEqual(imageId)
        expect(response.imageUrl).toEqual('https://cloudinary.com/image.jpg')
        expect(response.compressedUrl).toEqual('https://cloudinary.com/compressed.jpg')
        expect(response.createdAt).toBeDefined()
    })
    it('should return undefined if no image object found', async () => {
        const imageId: string = '64b6617748277b450c613b15'
        jest.spyOn(require('../../models/ImageMetadata').ImageMetadata, 'findById').mockReturnValue(
            Promise.resolve(undefined)
        )

        const response = await getImageById(imageId)

        expect(response).toBeUndefined()
    })
})