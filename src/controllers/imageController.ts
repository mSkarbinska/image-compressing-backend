import express from 'express';

const imageService = require('../services/imageService');

interface MulterRequest extends express.Request {
    file: any;
}

const uploadImage = async (req: MulterRequest, res: express.Response) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' });
      }
    try {
        const imageFileBuffer = req.file?.buffer; 

        const result = await imageService.uploadImage(imageFileBuffer); // {ImageUrl, taskId, imageName (generated like docker names)}
        console.log(result.imageUrl)
        return res.status(200).send({ taskId: result.taskId });
    } catch (error) {
        console.log(error)
        return res.status(500).send({ error: "Image compression failed." });
    }
  }


module.exports = {
    uploadImage
};

