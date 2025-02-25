import { ChatItemInterface, messageItemInterface } from "@/Interfaces/types";
import {
  getLocalStrogeItem,
  removeLocalStrogeItem,
  setLocalStorage,
} from "@/lib/utils";
import { create } from "zustand";

type intialStateType = {
  chats: ChatItemInterface[];
  setChats: (chats: ChatItemInterface[]) => void;
  updateChatLastMessage: (message: messageItemInterface) => void;
  setChat: (chat: ChatItemInterface) => void;
  messages: messageItemInterface[];
  setMessages: (messages: messageItemInterface[]) => void;
  setMessage: (messages: messageItemInterface) => void;
  unreadMessages: messageItemInterface[];
  setUnreadMessage: (unreadMessages: messageItemInterface) => void;
  removeUnreadMessage: (chatId: number) => void;
  currentChat: ChatItemInterface | null;
  setCurrentChat: (chat: ChatItemInterface | null) => void;
  resetCurrentChat: () => void;
  removeCurrentChat: () => void;
  typingEffect: { isTyping: boolean; chatId: number | null };
  setIsTyping: (isTyping: boolean, chatId: number) => void;
  selfTyping: boolean;
  setSelfTyping: (selfTyping: boolean) => void;
  reset: () => void;
};

export const useChat = create<intialStateType>()((set) => ({
  chats: [],
  messages: [],
  unreadMessages: [],
  currentChat: getLocalStrogeItem("currentChat"),
  typingEffect: { chatId: null, isTyping: false },
  selfTyping: false,
  setChats: (chats) => {
    set((prev) => ({
      ...prev,
      chats: chats,
    }));
  },
  updateChatLastMessage: (message) => {
    // console.log(message);

    set((prev) => {
      const chat = prev.chats.find(
        (chat) => chat.id === message.conversation_id
      );

      if (chat) {
        chat.updatedAt = message.createdAt;
        chat.lastMessage = message;
        console.log(chat);
        return {
          ...prev,
          chats: [
            chat,
            ...prev.chats.filter((chat) => chat.id !== message.conversation_id),
          ],
        };
      }
      // console.log(chat);
      return prev;
    });
  },
  setChat: (chat) => {
    set((prev) => ({
      ...prev,
      chats: [chat, ...prev.chats],
    }));
  },
  setMessages: (messages) => {
    set((prev) => ({
      ...prev,
      messages: messages,
    }));
  },
  setMessage: (message) => {
    set((prev) => ({
      ...prev,
      messages: [message, ...prev.messages],
    }));
  },
  setUnreadMessage: (unreadMessage) => {
    set((prev) => ({
      ...prev,
      unreadMessages: [...prev.unreadMessages, unreadMessage],
    }));
  },
  removeUnreadMessage: (chatId) => {
    // console.log("chat id to rem" + chatId);

    set((prev) => ({
      ...prev,
      unreadMessages: [
        ...prev.unreadMessages.filter(
          (message) => message.conversation_id !== chatId
        ),
      ],
    }));
  },
  setCurrentChat: (chat) => {
    // console.log("curr");

    set((prev) => {
      if (prev.currentChat?.id !== chat?.id) {
        setLocalStorage("currentChat", chat);
        return {
          ...prev,
          currentChat: chat,
        };
      }
      // If the same, return the previous state unchanged
      return prev;
    });
  },
  resetCurrentChat: () => {
    set((prev) => {
      if (prev.currentChat?.id) {
        removeLocalStrogeItem("currentChat");
        return {
          ...prev,
          currentChat: null,
        };
      }
      return prev;
    });
  },
  removeCurrentChat: () => {
    set((prev) => ({
      ...prev,
      currentChat: null,
    }));
  },
  setIsTyping: (isTyping, chatId) => {
    set((prev) => ({
      ...prev,
      typingEffect: { isTyping, chatId },
    }));
  },
  setSelfTyping: () => {},
  reset: () => {
    set(() => ({
      chats: [],
      messages: [],
      unreadMessages: [],
      currentChat: null,
      isTyping: false,
      selfTyping: false,
    }));
    // set((prev)=>{ // Reset all state to initial values
    //   chats: [],
    //   messages: [],
    //   unreadMessages: [],
    //   currentChat:  null,
    //   isTyping: false,
    //   selfTyping: false,
    // })
  },
}));
