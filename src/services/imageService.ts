const messageQueue = require('../utils/messageQueue');
const helpers = require('../utils/helpers');
const imageModel = require('../models/imageModel');


const uploadImage = async (imageUrl: string, imageName: string) => {
    const taskId = helpers.generateTaskId(imageName);
  
    const imageMetadataMessage = {
        taskId,
        imageUrl,
        imageName,
    };
    
    try {
        await imageModel.saveImageMetadata(imageMetadataMessage)
        await messageQueue.sendMessage(imageMetadataMessage);
        
        return new Promise((resolve) => {
            // assume that the worker completes the task asynchronously.
            resolve({ imageUrl, taskId, imageName });
        });
    } catch (error) {
        console.log(error)
        throw new Error('Failed to send image compression task to the queue.');
    }
}


const getImageById = async (id: string) => {
    try {
        const imageMetadata = await imageModel.ImageMetadata.findById(id);
        return imageMetadata;
    } catch (error) {
        console.log(error)
        throw new Error('Failed to get image metadata from the database.');
    }
}


const getImageByTaskId = async (taskId: string) => {
    try {
        const imageMetadata = await imageModel.ImageMetadata.findOne({ taskId });
        return imageMetadata;
    } catch (error) {
        console.log(error)
        throw new Error('Failed to get image metadata from the database.');
    }
}


module.exports = {
    uploadImage,
    getImageById
};