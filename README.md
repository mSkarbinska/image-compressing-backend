# Image compression service
## Description
This project demonstrates how to build and dockerize scalable image compressing service.
It consists of a compressing API built with Node.js and a Python worker for file processing.
The communication between the API and the worker is established using Redis queues and topics. \
For storing images and their compressed versions, the API uses free tier alternative to Amazon S3 - [Cloudinary](https://cloudinary.com/). 
Images data is stored in MongoDB. 
Nginx is used as a reverse proxy for the API. 
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
```git clone https://github.com/mSkarbinska/image-compression-service```
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

### Endpoints:
The server exposes several endpoints to interact with the image compressing service:

    POST /images/upload
This endpoint allows clients to upload full-size images to the server. The server then sends the images to Cloudinary for storage and adds a compressing task to the Redis queue. This asynchronous processing approach ensures that image compression tasks are decoupled from the image upload process, enabling better scalability and responsiveness.

    GET /images
Provides a list of all images' metadata stored in the database. Clients can use this endpoint to retrieve information about the images available in the system, including their URLs and compression status.

    GET /images/:id
Clients can use this endpoint to obtain detailed information about a specific image based on its unique ID. This information includes the image's URL and compressed version URL, if available.

    GET /tasks/:id
Returns data related to a single compressing task based on its unique ID. Clients can use this endpoint to track the progress and details of ongoing or completed image compression tasks.

    GET /tasks/:id/status
Provides the status of a specific compressing task based on its unique ID. Clients can use this endpoint to check whether a particular task is pending, completed, completed with errors, or has failed.


## MongoDB
### Models:
```javascript
const compressingTaskSchema = new Schema({
    imageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ImageMetadata'
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'completed_with_errors', 'failed'],
        default: 'pending'
    }
}, {
    timestamps: true
})

export const CompressingTask = mongoose.model('CompressingTask', compressingTaskSchema)
```
The **CompressingTask** model is used to store information about image compression tasks. It has two main fields:
- `imageId` - reference to the ImageMetadata model. This establishes a relationship between the compression task and the image it is meant to compress.
- `status` - indicates the status of the task. It can be one of the following values:
    - `pending` - the task is waiting to be processed by the worker
    - `completed` - the task has been completed successfully
    - `completed_with_errors` - the task has been completed, but some errors occurred during the process
    - `failed` - the task has failed

```javascript
const imageMetadataSchema = new Schema({
    imageUrl: {
        type: String,
        required: true,
    },
    compressedUrl: {
        type: String,
        default: null,
    }
}, {
    timestamps: true
})

export const ImageMetadata = mongoose.model('ImageMetadata', imageMetadataSchema)

```

The **ImageMetadata** model is used to store metadata related to images. It contains the following fields:
- `imageUrl` - URL of the full size image stored in Cloudinary
- `compressedUrl` - URL of the compressed image stored in Cloudinary.  It is set to null by default, indicating that the image has not been compressed yet.


## Worker
The image compression worker is a Python script responsible for compressing images received from the compressing API. It runs continuously, processing tasks from a Redis queue and interacting with MongoDB and Cloudinary for image processing and storage.
After the task of compression is done, it sends a message to a Redis topic with the result of the task. The message is then received by the API. \
### Multiprocessing:
The script uses multiprocessing to create multiple workers, where each worker acts as an independent image compressor. By distributing tasks across these workers, the system achieves parallel processing of images, improving efficiency and throughput. The blpop method ensures safe task consumption from the Redis queue, preventing duplicate processing and ensuring seamless task distribution among the workers.
```python
 def take_task_from_queue(self):
        result = self.client.blpop(self.tasks_queue_name)
        logging.info(f"Task taken from {self.tasks_queue_name} queue.")
        return result[1]
 ```
### Image compression:
The compression is done using the Pillow library. The script first downloads the image from Cloudinary, then compresses it and uploads the compressed version back to Cloudinary. The script also updates the status of the task in MongoDB, indicating whether the compression was successful or not.
```python
    def process_image(self, image_url):
        try:
            image_bytes = self.cloudinary_client.download_image(image_url)
            image = self.open_and_convert_image(image_bytes)
            compressed_image_bytes = self.perform_image_compression(image)
            compressed_image_url = self.upload_compressed_image(compressed_image_bytes)

            logging.info("Image processed successfully")

            return compressed_image_url
        except (ImageDownloadError, OpenAndConvertImageError, CompressImageError) as e:
            raise ProcessImageError(e)
        except Exception as e:
            raise UnknownProcessImageError(e)
```
## Client

The client component is built with React and Vite. It allows users to upload images to the server and retrieve information about the image. \
![client.png](media%2Fclient-photos.png)
![client.png](media%2Fclient-image-info.png)

For optimized information fetching, the client uses the React Query library. It provides a declarative approach to data fetching and caching, which helps avoid unnecessary network requests and improves performance. \
Application cahces images data from the server and updates it only on new upload. 
```typescript

export const useGetImagesData = (): UseQueryResult<ImageData[]> => useQuery([IMAGES_LIST_KEY],
        async () => {
             // Images data fetching
        })


export const useUploadImage = () => {
  const queryClient = useQueryClient()
  return useMutation(async (image: File) => {
             // Image upload
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries([IMAGES_LIST_KEY])
            },
          })
}
```
## Redis
For communication between the API and the worker, the system uses Redis queues and topics. The API adds compressing tasks to the queue, and the worker consumes them. After the compression is done, the worker publishes the result of the task to a Redis topic. The API then receives the message and updates the status of the task in MongoDB. 
```typescript
export const sendMessageToQueue =  (message: QueueMessage) => {
  const messageString = JSON.stringify(message)
  redisQueueClient.lpush(queueName, messageString, (err: any) => {
    if (err) {
      logger.error('Error sending message to Redis queue:', err)
    } else {
      logger.info('Message sent to Redis queue:', message)
    }
  })
}
```

```python
    def take_task_from_queue(self):
        result = self.client.blpop(self.tasks_queue_name)
        logging.info(f"Task taken from {self.tasks_queue_name} queue.")
        return result[1]

    def publish_result(self, message):
        deliveries_count = self.client.publish(self.results_topic_name, message)
        logging.info(f"Message published to {self.results_topic_name} topic. {deliveries_count} consumers received the message.")
```

## Nginx
The Nginx server is used as a reverse proxy for the API. It hides the API's internal structure and exposes only the necessary endpoints to the outside world. 

```
server {
    listen 80;  # Port on which Nginx will listen for incoming requests

    location / {
        proxy_pass http://app_service:3003;  # Points to the backend of service
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
## Cloudinary
Cloudinary is a cloud-based image and video management service. It provides a free tier that allows users to store up to 25GB of media and perform up to 25,000 transformations per month. The service also offers a generous free tier, so it is a great alternative to Amazon S3 for small projects. 

## Future improvements
- Add authentication and authorization to the API
- Add tasks UI to the client
- Add push notifications to the client
- Use nginx to serve the client app
- Prod and Dev Docker Compose files



