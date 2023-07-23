import {mongoose} from '@typegoose/typegoose'

const Schema = mongoose.Schema

const compressingTaskSchema = new Schema({
    imageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ImageMetadata'
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'completed_with_errors', 'failed'],
        default: 'pending'
    }
},{
    timestamps: true
})

export const CompressingTask = mongoose.model('CompressingTask', compressingTaskSchema)
