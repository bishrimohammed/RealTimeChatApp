import { AxiosInstance } from "@/api/AxiosInstance";
import { useQuery } from "@tanstack/react-query";

export const useGetMessages = (chatId: number) => {
  return useQuery({
    queryKey: ["messages", chatId],
    queryFn: async () => {
      return AxiosInstance.get(`/messages/${chatId}`, {
        // headers: { Authorization: "Bearer " + getLocalStrogeItem("token") },
      }).then((res) => res.data);
    },
    staleTime: 10 * 5 * 1000,
    enabled: !!chatId,
  });
};
