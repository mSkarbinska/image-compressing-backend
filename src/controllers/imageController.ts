import express from 'express';

const imageService = require('../services/imageService');


const uploadImage = async (req: {file: Express.Multer.File}, res: express.Response) => {
    try {
        const imageFile = req.file.buffer; 

        const result = await imageService.uploadImage(imageFile); // {ImageUrl, taskId, imageName (generated like docker names)}

        return res.status(200).send({ taskId: result.taskId });
    } catch (error) {
        console.log(error)
        return res.status(500).send({ error: "Image compression failed." });
    }
  }


module.exports = {
    uploadImage
};

