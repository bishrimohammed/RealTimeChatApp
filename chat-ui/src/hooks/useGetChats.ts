import { AxiosInstance } from "@/api/AxiosInstance";
import { getLocalStrogeItem } from "@/lib/utils";
import { useChat } from "@/store/ChatStore";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export const useGetChats = () => {
  //   const setChats = useChat((state) => state.setChats);
  return useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      return AxiosInstance.get("/chats", {
        // headers: { Authorization: "Bearer " + getLocalStrogeItem("token") },
      }).then((res) => res.data);
    },
    staleTime: 10 * 5 * 1000,
  });
};
