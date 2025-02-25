import { AxiosInstance } from "@/api/AxiosInstance";
import { useMutation } from "@tanstack/react-query";
import { toast } from "./use-toast";

export const useCreateGroupChat = () => {
  return useMutation({
    mutationFn: async (data: { name: string; members: number[] }) => {
      return await AxiosInstance.post("/chats/group", data);
    },
    onSuccess(data, variables, context) {},
    onError(error, variables, context) {
      console.log(error);

      toast({ description: "Can't create group chat" });
    }, // Handle errors if necessary
    // Add more options as needed (e.g., retry, cache, etc.)
  });
};
