# Image compressing tool
## Description
This project consists of a compressing API built with Node.js and a Python worker for actual file processing.
The communication between the API and the worker is established using Redis queues and topics. \
For storing images and their compressed versions, the API uses free tier alternative to Amazon S3 - [Cloudinary](https://cloudinary.com/). 

