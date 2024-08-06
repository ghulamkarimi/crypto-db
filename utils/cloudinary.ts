import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY, // Ensure API key is enclosed in quotes as a string
  api_secret: process.env.API_SECRET, // Ensure API secret is enclosed in quotes as a string
});

export const cloudinaryUploadImage = async (fileUpload: any) => {
  try {
    const data = await cloudinary.uploader.upload(fileUpload, {
      resource_type: "auto",
    });
    return { url: data.secure_url };
  } catch (error) {
    return error;
  }
};
