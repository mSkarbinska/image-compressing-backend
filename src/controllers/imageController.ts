import express from 'express';
const imageService = require('../services/imageService');


const compressImage = async (req: express.Request, res: express.Response) => {
    try {
      const { imageUrl='aa', imageName='bb' } = req.body
      const result = await imageService.compressImage(imageUrl, imageName);
      return res.status(200).send({ taskId: result.taskId });
    } catch (error) {
        console.log(error)
      return res.status(500).send({ error: "Image compression failed." });
    }
  }


module.exports = {
    compressImage
};

