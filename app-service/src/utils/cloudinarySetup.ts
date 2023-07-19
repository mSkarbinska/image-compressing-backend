import * as dotenv from 'dotenv'
import {v2 as cloudinary} from 'cloudinary'
dotenv.config()

function initializeCloudinary() {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        })
        console.log('Connected to Cloudinary')
    } catch (error) {
        console.error('Error connecting to Cloudinary:', error)
    }
}

initializeCloudinary()