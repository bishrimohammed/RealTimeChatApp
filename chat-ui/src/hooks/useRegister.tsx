import { AxiosInstance } from "@/api/AxiosInstance";
import { useMutation } from "@tanstack/react-query";
type userRegistration = {
  name: string;
  password: string;
  email: string;
  avatar?: any;
};
export const useRegister = () => {
  return useMutation({
    mutationFn: async (data) => {
      return AxiosInstance.post("/users", data);
    },
  });
};
