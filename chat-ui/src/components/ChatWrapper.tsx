import { useChat } from "@/store/ChatStore";
import ChatItem from "./ChatItem";
import { useSocket } from "@/context/socketContext";
import { useEffect } from "react";
import { ChatEventEnum } from "@/lib/constants";
import { ChatItemInterface, messageItemInterface } from "@/Interfaces/types";
import MenuComponent from "./MenuComponent";
import { Input } from "./ui/input";

const ChatWrapper = () => {
  const chats = useChat((state) => state.chats);
  const currentChat = useChat((state) => state.currentChat);
  const unreadMessages = useChat((state) => state.unreadMessages);
  const setUnreadMessage = useChat((state) => state.setUnreadMessage);
  const updateChatLastMessage = useChat((state) => state.updateChatLastMessage);
  const setIsTyping = useChat((state) => state.setIsTyping);
  const setMessage = useChat((state) => state.setMessage);
  const { socket } = useSocket();
  // console.log(unreadMessages);
  const onNewMessage = (message: messageItemInterface) => {
    if (currentChat?.id === message.conversation_id) {
      // console.log("the same conversation");

      setMessage(message);
    } else {
      // console.log("not the same chat");

      setUnreadMessage(message);
    }
    updateChatLastMessage(message);
    // console.log(message);
  };
  const handleOnSocketTyping = (chatId: number) => {
    // Check if the typing event is for the currently active chat.
    // console.log("checking for typing");
    const isTypingAleadySet = useChat.getState().typingEffect.chatId === chatId;
    if (!isTypingAleadySet) {
      setIsTyping(true, chatId);
    }
  };
  const handleOnSocketStopTyping = () => {
    // Check if the typing event is for the currently active chat.
    // setIsTyping(false,null)
    useChat.setState((prev) => ({
      ...prev,
      typingEffect: { isTyping: false, chatId: null },
    }));
    console.log("typing stoped...");
  };
  // const onNewChat = (chat: ChatItemInterface) => {
  //   useChat.setState((prev) => ({ ...prev, chats: [chat, ...prev.chats] }));
  // };
  useEffect(() => {
    if (!socket) return;
    socket.on(ChatEventEnum.MESSAGE_RECEIVED_EVENT, onNewMessage);
    socket.on(ChatEventEnum.TYPING_EVENT, handleOnSocketTyping);
    socket.on(ChatEventEnum.STOP_TYPING_EVENT, handleOnSocketStopTyping);
    // socket.on(ChatEventEnum.NEW_CHAT_EVENT, onNewChat);

    return () => {
      socket.off(ChatEventEnum.MESSAGE_RECEIVED_EVENT, onNewMessage);
      socket.off(ChatEventEnum.TYPING_EVENT, handleOnSocketTyping);
      socket.off(ChatEventEnum.STOP_TYPING_EVENT, handleOnSocketStopTyping);
      // socket.off(ChatEventEnum.NEW_CHAT_EVENT, onNewChat);
    };
  }, [currentChat]);
  return (
    <>
      <div className="py-2 px-4 h-12  sticky top-0 bg-dark z-20 flex  items-center w-full gap-3">
        {/* <Button
            onClick={() => {
              reset();
              logout();
            }}
          >
            heloo
          </Button> */}
        <div className="flex-shrink-0">
          <MenuComponent />
        </div>
        <div className="flex-grow flex-1  ">
          <Input type="search" placeholder="search..." className="w-full" />
        </div>
        <div className="flex items-center gap-3"></div>
      </div>
      <div className=" overflow-y-auto h-[calc(100vh-50px)] mb-3">
        <div className="flex flex-col gap-3  diplayScroll p-1 ">
          {chats?.map((chat) => (
            <ChatItem
              key={chat.id}
              chat={chat}
              isActive={currentChat?.id === chat.id}
              unreadCount={
                unreadMessages.filter((m) => m.conversation_id === chat.id)
                  .length
              }
            /> // Passing chat and currentChat as props to ChatItem component
          ))}
          {/* <ChatItem /> */}
        </div>
      </div>
    </>
  );
};

export default ChatWrapper;
