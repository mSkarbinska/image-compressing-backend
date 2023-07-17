const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const imageMetadataSchema = new Schema({
    imageUrl: {
        type: String,
        required: true,
    },
    thumbnailUrl: String,
    imageName: {
        type: String,
        required: true,
    },
    taskId: {
        type: String,
        unique: true,
    }
},{
    timestamps: true 
});


const ImageMetadata = mongoose.model('ImageMetadata', imageMetadataSchema)


const saveImageMetadata = async (imageMetadataMessage) => {
    try {
        const imageMetadata = new ImageMetadata(imageMetadataMessage);
        const result = await imageMetadata.save();
        console.log(result);
    } catch (error) {
        console.log(error);
        throw new Error('Failed to save image metadata to the database.');
    }
};


module.exports = {
    saveImageMetadata,
    ImageMetadata
}