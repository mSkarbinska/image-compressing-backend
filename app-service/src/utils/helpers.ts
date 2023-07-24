import {v2 as cloudinary} from 'cloudinary'
import {Readable} from 'stream'
import {logger} from './logger'

const options = {
    folder: 'images'
}
export const uploadImageToCloudinary = async (buffer: Buffer): Promise<string> => {
    logger.info('Uploading image to cloudinary')

    return new Promise((res) => {
        const theTransformStream = cloudinary.uploader.upload_stream(
            options,
            (err, result) => {
                if (err) {
                    logger.error(err.message)
                    throw new Error('Failed to upload image to cloudinary.')
                }

                logger.info(`Image uploaded to cloudinary. Image URL: ${result?.secure_url}`)
                res(result?.secure_url || '')
            }
        )
        const str = Readable.from(buffer)
        str.pipe(theTransformStream)
    })
}


export const isValidURL = (inputURL: string): boolean => {
    try {
        const parsedURL = new URL(inputURL)
        return !!parsedURL
    } catch (error) {
        logger.error(error)
        throw new Error('Invalid URL string')
    }
}