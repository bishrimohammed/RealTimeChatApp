import { AxiosInstance } from "@/api/AxiosInstance";
import { userlogin } from "@/Interfaces/user";
import { useMutation } from "@tanstack/react-query";

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: userlogin) => {
      return AxiosInstance.post("/users/login", data);
    },
  });
};
