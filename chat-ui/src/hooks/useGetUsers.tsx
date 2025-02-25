import { AxiosInstance } from "@/api/AxiosInstance";
import { useQuery } from "@tanstack/react-query";

export const useGetUsers = (query: string) => {
  return useQuery({
    queryKey: ["users", query],
    queryFn: async () => {
      return AxiosInstance.get("/users", { params: { q: query } }).then(
        (res) => res.data
      );
    },
    staleTime: 20 * 60 * 1000,
    // enabled: !!query,
  });
};
