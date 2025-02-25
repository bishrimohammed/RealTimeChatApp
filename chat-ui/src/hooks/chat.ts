import { AxiosInstance } from "@/api/AxiosInstance";
import { UserInterface } from "@/Interfaces/types";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";

export const useCreateOrGet1to1Chat = () => {
  return useMutation({
    mutationFn: async (receiverId: number) => {
      return await AxiosInstance.post(`/chats/${receiverId}`);
    },
    onError(error, variables, context) {},
  });
};

export const useGetChatParticipants = (chatId: number) => {
  return useInfiniteQuery<{
    data: UserInterface[];
    nextPage: number | null;
  }>({
    queryKey: ["Chat Members", chatId],
    queryFn: async ({ pageParam }) => {
      return await AxiosInstance.get(
        `/chats/${chatId}/participants?page=${pageParam}`
      ).then((res) => res.data);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      // if (!lastPage.data || lastPage.data.length === 0) {
      //   return undefined;
      // }
      if (!lastPage.nextPage) {
        return undefined;
      }
      // Return the next page number
      return lastPage.nextPage;
    },
    // select:(data)=>({})
  });
};

export const useGetUsersNotMemberOfChat = (chatId: number) => {
  return useInfiniteQuery({
    queryKey: ["Users", chatId],
    queryFn: async ({ pageParam }) => {
      return await AxiosInstance.get(
        `/users/chat/${chatId}?page=${pageParam}`
      ).then((res) => res.data);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      // if (!lastPage.data || lastPage.data.length === 0) {
      //   return undefined;
      // }
      if (!lastPage.nextPage) {
        return undefined;
      }
      // Return the next page number
      return lastPage.nextPage;
    },
  });
};

export const useAddChatParticipants = () => {
  return useMutation({
    mutationFn: async (data: { chatId: number; members: number[] }) => {
      return await AxiosInstance.post(`/chats/${data.chatId}/participants`, {
        members: data.members,
      });
    },
    // onSuccess(data, variables, context) {},
    // onError(error, variables, context) {
    //   console.log(error);
    // },
  });
};
