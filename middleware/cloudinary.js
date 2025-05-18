import { v2 as cloudinary } from "cloudinary"
import dotenv from 'dotenv';

dotenv.config();
cloudinary.config({
    cloud_name: process.env.your_cloud_name,
    api_key: process.env.your_api_key,
    api_secret: process.env.your_api_secret,
  });
  
  const uploadImage = async (file) => {
    try {
      let res = await cloudinary.uploader.upload(file);
      return  res.secure_url
    } catch (error) {
      console.error('Upload failed:', error);
      throw error; 
    }
  };
  export default uploadImage;