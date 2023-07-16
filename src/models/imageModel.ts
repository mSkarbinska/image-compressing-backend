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


module.exports = mongoose.model('ImageMetadata', imageMetadataSchema)