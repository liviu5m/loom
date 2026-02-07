import type { SignupData } from "@/lib/Types";
import axios from "axios";
const baseUrl = import.meta.env.VITE_API_URL;

export async function singupFunction(data: SignupData) {
  const response = await axios.post(`${baseUrl}/auth/signup`, data);
  return response.data;
}
