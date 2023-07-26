# Image compressing service
## Description
This project consists of a compressing API built with Node.js and a Python worker for file processing.
The communication between the API and the worker is established using Redis queues and topics. \
For storing images and their compressed versions, the API uses free tier alternative to Amazon S3 - [Cloudinary](https://cloudinary.com/). 

## Requirements
- [Node.js](https://nodejs.org/en/)
- [Python 3.8](https://www.python.org/downloads/release/python-380/)
- [Redis](https://redis.io/)
- [Cloudinary](https://cloudinary.com/) account
- [MongoDB](https://www.mongodb.com/) account
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Docker](https://www.docker.com/) (optional)

## How to run it with Docker Compose
1. Clone the repository \
```git clone https://github.com/mSkarbinska/image-compressing-service```
2. Create a `.env` file in the root directory of the project and fill it with the following variables:
```DEV=true
PORT=3003
NGINX_PORT=80
REDIS_PORT=6379
REDIS_HOST=redis
CLIENT_PORT=5005
MONGODB_URI=<your_mongodb_uri>
CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
CLOUDINARY_API_KEY=<your_cloudinary_api_key>
CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
REDIS_QUEUE_NAME='image-queue'
TOPIC_NAME=<tasks-results>
PUBLIC_VAPID_KEY=<server_public_vapid_key>
PRIVATE_VAPID_KEY=<server_private_vapid_key>
```
3. Run the project with Docker Compose \
```docker-compose up```
4. Open the browser and go to `localhost:5005` to see the client app:
![client.png](media%2Fclient.png)

## Server

API is built with Node.js, TypeScript and Express.js. \
It exposes the following endpoints:
- `POST /images/upload` - uploads full size image to Cloudinary and adds a compressing task to the Redis queue
- `GET /images` - returns a list of all images data stored in the database
- `GET /images/:id` - returns data of a single image
- `GET /tasks/:id` - returns data of a single task
- `GET /tasks/:id/status` - returns status of a single task

## Worker

## Client

## MongoDB

## Redis

## Nginx

## CLoudinary

## Web Push Notifications



