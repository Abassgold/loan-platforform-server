import { v2 } from "cloudinary"

v2.config({
    cloud_name: process.env.your_cloud_name,
    api_key: process.env.your_api_key,
    api_secret: process.env.your_api_secret,
  });
  
  const uploadImage = async (file1, file2) => {
    try {
      let res1 = await v2.uploader.upload(file1, {
        upload_preset: 'my_preset'
      });
      let res2 = await v2.uploader.upload(file2, {
        upload_preset: 'my_preset'
      });
      console.log('Upload success:', result.secure_url);
      return {
        firstImageUrl: res1.secure_url,
        secondImageUrl: res2.secure_url
      };
      console.log(res1);
      console.log(res2);
      
      
    } catch (error) {
      console.error('Upload failed:', error);
      throw error; 
    }
  };
  export default uploadImage;