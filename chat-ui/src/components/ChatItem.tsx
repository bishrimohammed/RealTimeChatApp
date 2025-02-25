import { ChatItemInterface } from "@/Interfaces/types";
import { formatLastChatMessageDate } from "@/lib/helpers";
import { getChatObjectMetadata } from "@/lib/utils";
import { useAuth } from "@/store/AuthContext";
import { useChat } from "@/store/ChatStore";
// import { ChatEventEnum } from "@/lib/constants";

import React, { memo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
type chatPropsType = {
  chat: ChatItemInterface;
  isActive: boolean;
  unreadCount: number;
};
const ChatItem: React.FC<chatPropsType> = ({ chat, isActive, unreadCount }) => {
  // console.log(chat);
  // const { socket } = useSocket();

  const user = useAuth((state) => state.user);
  const setCurrentChat = useChat((state) => state.setCurrentChat);
  const removeUnreadMessage = useChat((state) => state.removeUnreadMessage);

  return (
    <div
      role="button"
      onClick={() => {
        if (!isActive) {
          // setCurrentChat(chat);
        }
        setCurrentChat(chat);
        // if (socket) {
        //   socket.emit(ChatEventEnum.JOIN_CHAT_EVENT, chat?.id);
        // }
        if (unreadCount > 0) {
          removeUnreadMessage(chat.id);
        }

        // Emit an event to join the current chat
      }}
      className={`p-2 flex items-center justify-start gap-2 border-b-[0.1px] pb-2 cursor-pointer hover:bg-slate-100/70 ${
        isActive ? "bg-slate-100/70" : ""
      }`}
    >
      <Avatar>
        <AvatarImage
          src={getChatObjectMetadata(chat, user!).avatar?.url}
          alt="avatar"
        />
        <AvatarFallback>
          {getChatObjectMetadata(chat, user!).title.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      {/* <div className="flex justify-center items-center flex-shrink-0"> */}
      {/* <div className="w-12 h-12 bg-slate-500 rounded-full flex items-center justify-center text-white">
          <span className=" text-2xl">
            {getChatObjectMetadata(chat, user!).avatar}
          </span>
        </div> */}
      {/* <Avatar>
          <AvatarImage
            src={getChatObjectMetadata(chat, user!).avatar?.url}
            alt="avatar"
          />
          <AvatarFallback>
            {getChatObjectMetadata(chat, user!).title.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar> */}
      {/* </div> */}

      <div className="w-full flex flex-col gap-1">
        <p className="text-sm truncate-1 font-medium text-slate-900">
          {/* User Name */}
          {getChatObjectMetadata(chat, user!).title}
        </p>
        <div className="w-full inline-flex items-center text-left ">
          {" "}
          <p className="text-xs truncate-1 text-slate-500   text-ellipsis inline-flex items-center">
            {/* Last Active: 10:00 AM */}
            {/* {getChatObjectMetadata(chat, user!).lastMessage} */}
            <ChatTypingEffect chat={chat} />
            {/* Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid,
            amet harum aliquam ducimus inventore vitae. Nulla aliquam impedit
            suscipit facilis! */}
          </p>
        </div>
      </div>
      <div className="flex text-slate-500  h-full text-sm flex-col justify-between items-end">
        <small className="mb-2 inline-flex flex-shrink-0 w-max">
          {formatLastChatMessageDate(chat.updatedAt)}
        </small>

        {/* Unread count will be > 0 when user is on another chat and there is new message in a chat which is not currently active on user's screen */}
        {unreadCount > 0 ? (
          <span
            className={`bg-[#4aac68] h-2 w-2 aspect-square flex-shrink-0 ${
              unreadCount > 9 ? "px-[12px] py-[10px]" : "p-[10px]"
            }   text-white text-xs rounded-full inline-flex justify-center items-center`}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : (
          <span className=" h-2 w-2 aspect-square flex-shrink-0  px-[12px] py-[10px] text-black text-xs rounded-full inline-flex justify-center items-center"></span>
        )}
      </div>
    </div>
  );
};

const ChatTypingEffect: React.FC<{ chat: ChatItemInterface }> = memo(
  ({ chat }) => {
    // console.log("chat Item re");

    const user = useAuth((state) => state.user);
    const typingEffect = useChat((state) => state.typingEffect);
    return typingEffect.isTyping && typingEffect.chatId === chat.id
      ? "typing"
      : getChatObjectMetadata(chat, user!).lastMessage;
  }
);
export default ChatItem;
