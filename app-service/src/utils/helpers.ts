import {v2 as cloudinary} from 'cloudinary'
import {Readable} from 'stream'

const options = {
    folder: 'images'
}
export const uploadImageToCloudinary = async (buffer: Buffer): Promise<string> => {
    return new Promise((res) => {
        const theTransformStream = cloudinary.uploader.upload_stream(
            options,
            (err, result) => {
                if (err) throw new Error('Failed to upload image to cloudinary.')
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
        throw new Error('Invalid URL string')
    }
}