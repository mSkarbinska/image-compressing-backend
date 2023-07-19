import {mongoose} from '@typegoose/typegoose'

const Schema = mongoose.Schema

const compressingTaskSchema = new Schema({
    imageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ImageMetadata'
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    }
},{
    timestamps: true
})

export const CompressingTask = mongoose.model('CompressingTask', compressingTaskSchema)

export const saveCompressingTaskToDb = async (imageId: string) => {
    try {
        const compressingTask = new CompressingTask({ imageId })
        return await compressingTask.save().then(task => task._id.toString())
    } catch (error) {
        console.log(error)
        throw new Error('Failed to save compressing task to the database.')
    }
}
