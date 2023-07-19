import {mongoose} from '@typegoose/typegoose'

const Schema = mongoose.Schema

const imageMetadataSchema = new Schema({
    imageUrl: {
        type: String,
        required: true,
    },
    compressedUrl: {
        type: String,
        default: null,
    }
},{
    timestamps: true
})

export const ImageMetadata = mongoose.model('ImageMetadata', imageMetadataSchema)

export const saveImageMetadataToDb = async (imageUrl: string) => {
    try {
        const imageMetadata = new ImageMetadata({ imageUrl })
        return await imageMetadata.save().then(image => image._id.toString())
    } catch (error) {
        console.log(error)
        throw new Error('Failed to save image metadata to the database.')
    }
}
