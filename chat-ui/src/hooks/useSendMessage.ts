import { AxiosInstance } from "@/api/AxiosInstance";
import { useMutation } from "@tanstack/react-query";
import React from "react";

export const useSendMessage = () => {
  return useMutation({
    mutationFn: async (data: { formData: any; chatId: number }) => {
      return AxiosInstance.post(`/messages/${data.chatId}`, data.formData);
    },
  });
};
