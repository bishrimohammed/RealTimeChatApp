import { useChat } from "@/store/ChatStore";
import MessageItem from "./MessageItem";
import { useAuth } from "@/store/AuthContext";

const Messages = () => {
  const messages = useChat((state) => state.messages);
  const user = useAuth((state) => state.user);
  // console.log("mmmmm");
  return (
    <div className="flex flex-col-reverse  gap-3 ">
      {/* {messages?.map((message) => (
        <MessageItem
          key={message.id}
          message={message}
          isOwnMessage={message.sender_id === user?.id}
        />
      ))} */}
      {messages?.map((message, index) => {
        const isPreviousMessageFromSameSender =
          index > 0 && messages[index - 1].sender_id === message.sender_id;

        return (
          <MessageItem
            key={message.id}
            message={message}
            isOwnMessage={message.sender_id === user?.id}
            isPreviousMessageFromSameSender={isPreviousMessageFromSameSender}
          />
        );
      })}
    </div>
  );
};

export default Messages;
