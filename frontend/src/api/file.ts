import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

export async function searchFiles(search: string) {
  const response = await axios.get(`${baseUrl}/file`, {
    params: {
      search,
    },
    withCredentials: true,
  });
  return response.data;
}