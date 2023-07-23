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
