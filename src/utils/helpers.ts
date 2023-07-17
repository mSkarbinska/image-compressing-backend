const uniqid = require('uniqid'); 
const cloudinary = require('cloudinary').v2;

const generateTaskId = (imageName:string) => {
    return uniqid('task-' + imageName + '-');
}

const generateImageName = () => {
    return 'img' + new Date().getTime()
}

async function uploadImageToCloudinary(imageBuffer:any) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'samples' }, 
        (error: any, result: any) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        }
      ).end(imageBuffer);
    });
  }


module.exports = {
    generateTaskId,
    generateImageName,
    uploadImageToCloudinary
};