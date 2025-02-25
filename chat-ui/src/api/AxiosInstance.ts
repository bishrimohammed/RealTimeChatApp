import { getLocalStrogeItem } from "@/lib/utils";
import axios, { AxiosError } from "axios";

export const AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URI + "/api/v1",
  withCredentials: true,
  headers: {
    Authorization: "Bearer " + getLocalStrogeItem("token"),
  },
});

AxiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const { status } = error;
    if (status === 401) {
      localStorage.removeItem("user");
      localStorage.removeItem("currentChat");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  }
);
