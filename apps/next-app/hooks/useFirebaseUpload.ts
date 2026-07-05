import { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import imageCompression from "browser-image-compression";
import { storage } from "../lib/firebase";

export type UploadStatus = "IDLE" | "COMPRESSING" | "UPLOADING" | "SUCCESS" | "ERROR";

export interface UploadState {
  progress: number;
  status: UploadStatus;
  url: string | null;
  error: string | null;
}

export function useFirebaseUpload() {
  const [uploadState, setUploadState] = useState<UploadState>({
    progress: 0,
    status: "IDLE",
    url: null,
    error: null,
  });

  const uploadImage = async (file: File, path: string = "complaints") => {
    try {
      setUploadState((prev) => ({ ...prev, status: "COMPRESSING" }));

      // 1. Compress the image
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      
      const compressedFile = await imageCompression(file, options);
      console.log(`Original: ${(file.size / 1024 / 1024).toFixed(2)}MB | Compressed: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);

      // 2. Upload to Firebase
      const fileName = `${Date.now()}_${compressedFile.name}`;
      const storageRef = ref(storage, `${path}/${fileName}`);
      
      const uploadTask = uploadBytesResumable(storageRef, compressedFile);

      setUploadState((prev) => ({ ...prev, status: "UPLOADING" }));

      return new Promise<string>((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadState((prev) => ({ ...prev, progress }));
          },
          (error) => {
            console.error("Upload failed", error);
            setUploadState({ progress: 0, status: "ERROR", url: null, error: error.message });
            reject(error);
          },
          async () => {
            // 3. Get the download URL on success
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setUploadState({ progress: 100, status: "SUCCESS", url: downloadURL, error: null });
            resolve(downloadURL);
          }
        );
      });
    } catch (error) {
      console.error("Error in upload process", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      setUploadState({ progress: 0, status: "ERROR", url: null, error: errorMessage });
      throw error;
    }
  };

  const resetState = () => {
    setUploadState({ progress: 0, status: "IDLE", url: null, error: null });
  };

  return { uploadImage, uploadState, resetState };
}
