import ImageMetadataMessage from '../types/imageMetadataMessage';

const messageQueue = require('../utils/messageQueue');
const helpers = require('../utils/helpers');
const imageModel = require('../models/imageModel');

const uploadImage = async (imageFileBuffer: any) => {
    const imageName = helpers.generateImageName();
    const taskId = helpers.generateTaskId(imageName);

    const imageUrl = await helpers.uploadImageToCloudinary(imageFileBuffer, imageName);

    const imageMetadataMessage: ImageMetadataMessage = {
        taskId,
        imageUrl,
        imageName,
    };

    try {
        const id = await imageModel.saveImageMetadata(imageMetadataMessage)
        await messageQueue.sendMessage({...imageMetadataMessage, imageDataId: id});

        return new Promise((resolve) => {
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