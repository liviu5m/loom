import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

export async function submitQuery(query: string) {
  const response = await axios.get(`${baseUrl}/document/search`, {
    params: { query },
    withCredentials: true,
  });
  return response.data;
}
