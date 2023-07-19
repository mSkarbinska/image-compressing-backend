import {v2 as cloudinary} from 'cloudinary'
import {Readable} from 'stream'

const options = {
    folder: 'images'
}
export const uploadImageToCloudinary = async (buffer: Buffer): Promise<string> => {
    return new Promise((res, rej) => {
        const theTransformStream = cloudinary.uploader.upload_stream(
            options,
            (err, result) => {
                if (err) return rej(err)
                res(result?.secure_url || '')
            }
        )
        const str = Readable.from(buffer)
        str.pipe(theTransformStream)
    })
}