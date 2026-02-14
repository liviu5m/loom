import type { LoginData, SignupData } from "@/lib/Types";
import axios from "axios";
const baseUrl = import.meta.env.VITE_API_URL;

export async function singupFunction(data: SignupData) {
  const response = await axios.post(`${baseUrl}/auth/signup`, data);
  return response.data;
}

export async function loginFunction(data: LoginData) {
  const response = await axios.post(`${baseUrl}/auth/login`, data, {
    withCredentials: true,
  });
  return response.data;
}

export async function getUser() {
  const response = await axios.get(`${baseUrl}/auth/user`, {
    withCredentials: true,
  });
  return response.data;
}

export async function logoutUser() {
  const response = await axios.post(`${baseUrl}/auth/logout`, {}, {
    withCredentials: true,
  });
  return response.data;
}
