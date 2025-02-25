import { Navigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import ChatItem from "../components/ChatItem";
import MessageItem from "../components/MessageItem";
import { Button } from "@/components/ui/button";
import { useChat } from "@/store/ChatStore";
import { useGetChats } from "@/hooks/useGetChats";
import { useEffect, useState } from "react";
import ChatWrapper from "@/components/ChatWrapper";
import MessageWrapper from "@/components/MessageWrapper";
import { formatLastChatMessageDate } from "@/lib/helpers";
import { useSocket } from "@/context/socketContext";
import { ChatEventEnum } from "@/lib/constants";
import { ChatItemInterface } from "@/Interfaces/types";

const Chat = () => {
  const user = useAuth((state) => state.user);
  // const logout = useAuth((state) => state.logout);
  const setChats = useChat((state) => state.setChats);
  const currentChat = useChat((state) => state.currentChat);
  // const reset = useChat((state) => state.reset);
  const { socket } = useSocket();
  // console.log(formatLastChatMessageDate("2024-01-01T22:26:09.000Z"));
  const { data, isPending } = useGetChats();
  const [isConnected, setIsConnected] = useState(false);
  const onConnect = () => {
    setIsConnected(true);
  };

  const onDisconnect = () => {
    setIsConnected(false);
  };
  const onNewChat = (chat: ChatItemInterface) => {
    useChat.setState((prev) => ({ ...prev, chats: [chat, ...prev.chats] }));
  };
  // console.log(user);
  useEffect(() => {
    if (data?.data) {
      setChats(data.data);
    }
  }, [data]);
  useEffect(() => {
    // If the socket isn't initialized, we don't set up listeners.
    if (!socket) return;

    // Set up event listeners for various socket events:
    // Listener for when the socket connects.
    socket.on(ChatEventEnum.CONNECTED_EVENT, onConnect);
    // Listener for when the socket disconnects.
    socket.on(ChatEventEnum.DISCONNECT_EVENT, onDisconnect);
    socket.on(ChatEventEnum.NEW_CHAT_EVENT, onNewChat);
    // Listener for when a user is typing.
    // socket.on(ChatEventEnum.TYPING_EVENT, handleOnSocketTyping);
    // // Listener for when a user stops typing.
    // socket.on(ChatEventEnum.STOP_TYPING_EVENT, handleOnSocketStopTyping);
    // // Listener for when a new message is received.
    // socket.on(ChatEventEnum.MESSAGE_RECEIVED_EVENT, onMessageReceived);
    // // Listener for the initiation of a new chat.
    // socket.on(ChatEventEnum.NEW_CHAT_EVENT, onNewChat);
    // // Listener for when a user leaves a chat.
    // socket.on(ChatEventEnum.LEAVE_CHAT_EVENT, onChatLeave);
    // // Listener for when a group's name is updated.
    // socket.on(ChatEventEnum.UPDATE_GROUP_NAME_EVENT, onGroupNameChange);
    // //Listener for when a message is deleted
    // socket.on(ChatEventEnum.MESSAGE_DELETE_EVENT, onMessageDelete);
    // When the component using this hook unmounts or if `socket` or `chats` change:
    return () => {
      // Remove all the event listeners we set up to avoid memory leaks and unintended behaviors.
      socket.off(ChatEventEnum.CONNECTED_EVENT, onConnect);
      socket.off(ChatEventEnum.DISCONNECT_EVENT, onDisconnect);
      socket.off(ChatEventEnum.NEW_CHAT_EVENT, onNewChat);
      // socket.off(ChatEventEnum.TYPING_EVENT, handleOnSocketTyping);
      // socket.off(ChatEventEnum.STOP_TYPING_EVENT, handleOnSocketStopTyping);
      // socket.off(ChatEventEnum.MESSAGE_RECEIVED_EVENT, onMessageReceived);
      // socket.off(ChatEventEnum.NEW_CHAT_EVENT, onNewChat);
      // socket.off(ChatEventEnum.LEAVE_CHAT_EVENT, onChatLeave);
      // socket.off(ChatEventEnum.UPDATE_GROUP_NAME_EVENT, onGroupNameChange);
      // socket.off(ChatEventEnum.MESSAGE_DELETE_EVENT, onMessageDelete);
    };

    // Note:
    // The `chats` array is used in the `onMessageReceived` function.
    // We need the latest state value of `chats`. If we don't pass `chats` in the dependency array,
    // the `onMessageReceived` will consider the initial value of the `chats` array, which is empty.
    // This will not cause infinite renders because the functions in the socket are getting mounted and not executed.
    // So, even if some socket callbacks are updating the `chats` state, it's not
    // updating on each `useEffect` call but on each socket call.
  }, [socket]);
  if (!user) {
    return <Navigate to="/login" replace={true} />;
  }
  if (isPending) return <div>loading</div>;
  // setChats(data.data);
  return (
    <>
      <div className="hidden sm:flex gap-1  h-screen overflow-hidden ">
        <div className="md:w-3/12   border-e-[0.1px] p-2  h-screen">
          {/* <div className=" overflow-y-auto h-[calc(100vh-50px)] mb-3"> */}

          <ChatWrapper />
          {/* </div> */}
        </div>
        <div className="md:w-9/12 flex-1">
          {currentChat?.id ? (
            <MessageWrapper />
          ) : (
            <div className="h-[100vh] flex justify-center items-center ">
              <p className="py-1 px-2 rounded-full bg-black/40 text-white text-sm text-center">
                Select a chat to start messaging
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="block sm:hidden gap-1  h-screen overflow-hidden ">
        {currentChat?.id ? (
          <div className="w-full ">
            <MessageWrapper />
          </div>
        ) : (
          <div className="w-full  border-e-[0.1px] p-2  h-screen">
            <ChatWrapper />
          </div>
        )}
      </div>
    </>
  );
};

export default Chat;
