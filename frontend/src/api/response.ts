import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

export async function createResponseFunc(question: string, response: string) {
  const data = { question, response };
  const responseObj = await axios.post(`${baseUrl}/response/`, data, {
    withCredentials: true,
  });
  return responseObj.data;
}
