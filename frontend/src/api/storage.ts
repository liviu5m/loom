import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

export async function uploadFileFunc(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(`${baseUrl}/storage/upload`, formData, {
    withCredentials: true,
  });
  return response.data;
}
