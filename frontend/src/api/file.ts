import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

export async function searchFiles(
  search: string,
  page: number,
  pageSize: number,
) {
  const response = await axios.get(`${baseUrl}/file`, {
    params: {
      search,
      page,
      size: pageSize,
    },
    withCredentials: true,
  });
  return response.data;
}

export async function deleteFileFunc(fileId: number) {
  const response = await axios.delete(`${baseUrl}/file/${fileId}`, {
    withCredentials: true,
  });
  return response.data;
}
