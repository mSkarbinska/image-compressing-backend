const messageQueue = require('../utils/messageQueue');
const ImageMetadata = require('../models/imageModel');

const compressImage = async (imageUrl: string, imageName: string) => {
    const taskId = generateTaskId(imageName);
  
    const message = {
        taskId,
        imageUrl,
        imageName,
    };

    const imageMetadata = new ImageMetadata({
        ...message})
    
    try {
        imageMetadata.save().then((result:any) => {
            console.log(result)
        }).catch((error:any) => {
            console.log(error)
            throw new Error('Failed to save image metadata to the database.')
        })

        await messageQueue.sendMessage(message);
        
        return new Promise((resolve) => {
            // assume that the worker completes the task asynchronously.
            resolve({ taskId });
        });
    } catch (error) {
        console.log(error)
        throw new Error('Failed to send image compression task to the queue.');
    }
}
  

const generateTaskId = (imageName:string) => {
    return '12345'
}


module.exports = {
    compressImage
};