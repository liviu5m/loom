import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

type FileUpload = {
  id: string;
  file: File;
  status: string;
  filePath?: string;
};

export async function uploadMultipleFiles(files: FileUpload[]) {
  const uploadPromises = files.map(async (fileItem) => {
    const formData = new FormData();
    formData.append("files", fileItem.file);

    try {
      const response = await axios.post(`${baseUrl}/storage/upload`, formData, {
        withCredentials: true,
      });

      return { ...fileItem, filePath: response.data.filepath };
    } catch (error) {
      console.error("Upload failed for:", fileItem.file.name, error);
      return { ...fileItem, status: "failed" };
    }
  });

  const allUploadResults = await Promise.all(uploadPromises);
  return allUploadResults;
}

export async function removeUploadedFile(filePath: string) {
  console.log(filePath);

  const response = await axios.delete(`${baseUrl}/storage/remove/${filePath}`, {
    withCredentials: true,
  });
  return response.data;
}
