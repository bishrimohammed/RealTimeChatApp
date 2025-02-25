import { ChatItemInterface, UserInterface } from "@/Interfaces/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const setLocalStorage = <T>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value));
};
export const getLocalStrogeItem = (key: string) => {
  const item = localStorage.getItem(key);
  if (item) {
    return JSON.parse(item);
  } else {
    return null;
  }
};
export const removeLocalStrogeItem = (key: string) => {
  localStorage.removeItem(key);
};

export const getChatObjectMetadata = (
  chat: ChatItemInterface, // The chat item for which metadata is being generated.
  loggedInUser: UserInterface // The currently logged-in user details.
) => {
  // console.log(chat);
  // console.log(loggedInUser);

  // Determine the content of the last message, if any.
  // If the last message contains only attachments, indicate their count.
  let lastMessage: string;
  let title: string;
  // console.log(chat.lastMessage);

  if (chat.isGroup) {
    lastMessage = chat?.lastMessage
      ? chat?.lastMessage?.sender?.name + ": " + chat?.lastMessage?.content
      : "No messages yet";
  } else {
    lastMessage = chat?.lastMessage
      ? chat?.lastMessage?.content
      : "No messages yet"; // Placeholder text if there are no messages.
  }

  // Case: Individual chat
  // Identify the participant other than the logged-in user.
  let avatar: {
    id: number;
    url: string;
  } | null;
  if (!chat.isGroup) {
    const friend = chat.participants.find((p) => p.user_id !== loggedInUser.id)
      ?.user!;
    // chat.userOne.id === loggedInUser.id ? chat.userTwo : chat.userOne;
    avatar = friend?.avatar;
    title = friend?.name;
  } else {
    avatar = chat.avatar;
    title = chat.name;
  }

  // Return metadata specific to individual chats.
  return {
    avatar, //friend.name.charAt(0).toUpperCase(), // Participant's avatar URL.
    title, // Participant's username serves as the title.
    // description: participant?.email, // Email address of the participant.
    lastMessage,
  };
};
