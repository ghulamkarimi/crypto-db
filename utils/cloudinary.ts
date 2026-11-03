import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const cloudinaryConfigured = () =>
  !!(process.env.CLOUD_NAME && process.env.API_KEY && process.env.API_SECRET);

// Speichert ein Bild. Mit Cloudinary-Zugangsdaten dort, sonst auf dem eigenen Server
// (public/uploads, erreichbar unter /uploads/<Datei>). Gibt immer { url } zurück oder wirft einen Fehler.
export const cloudinaryUploadImage = async (fileUpload: string): Promise<{ url: string }> => {
  if (cloudinaryConfigured()) {
    try {
      const data = await cloudinary.uploader.upload(fileUpload, { resource_type: "auto" });
      return { url: data.secure_url };
    } catch (error) {
      console.error("Cloudinary-Upload fehlgeschlagen, speichere lokal:", (error as Error)?.message);
    }
  }
  const dir = path.join("public", "uploads");
  fs.mkdirSync(dir, { recursive: true });
  const name = path.basename(fileUpload);
  fs.copyFileSync(fileUpload, path.join(dir, name));
  const base = (process.env.PUBLIC_URL || `http://localhost:${process.env.PORT || 3002}`).replace(/\/$/, "");
  return { url: `${base}/uploads/${encodeURIComponent(name)}` };
};
