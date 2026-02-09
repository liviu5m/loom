import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

export async function uploadMultipleFiles(files: File[]) {
  const uploadPromises = Array.from(files).map((file) => {
    const formData = new FormData();
    formData.append("files", file);

    return axios.post(`${baseUrl}/storage/upload`, formData, {
      withCredentials: true,
    });
  });

  return Promise.all(uploadPromises);
}