import { useChat } from "@/store/ChatStore";
import { memo, useEffect, useRef, useState } from "react";
import { BsFillSendFill } from "react-icons/bs";
// import { useAuth } from "@/store/AuthContext";
import { useGetMessages } from "@/hooks/useGetMessages";
import Messages from "./Messages";
import { useSendMessage } from "@/hooks/useSendMessage";
import { useSocket } from "@/context/socketContext";
import { ChatEventEnum } from "@/lib/constants";
import MessageHeader from "./MessageHeader";
import { GrAttachment } from "react-icons/gr";
import chatBgImqage from "../assets/pattern-31.svg";
// const ResetCurrentChat
const MessageWrapper = () => {
  // const user = useAuth((state) => state.user);
  const currentChat = useChat((state) => state.currentChat);
  const setMessages = useChat((state) => state.setMessages);
  const setMessage = useChat((state) => state.setMessage);
  const updateChatLastMessage = useChat((state) => state.updateChatLastMessage);
  // const resetCurrentChat = useChat((state) => state.resetCurrentChat);
  const [newMessage, setNewMessage] = useState("");
  const [attachmentFiles, setAttachedFiles] = useState<File[]>([]);
  const { data, isPending } = useGetMessages(currentChat?.id!);
  const { socket } = useSocket();
  // console.log(currentChat);

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // console.log(attachmentFiles.length);

  const { mutateAsync } = useSendMessage();
  useEffect(() => {
    if (data?.data) {
      setMessages(data.data);
    }
    // setNewMessage("");
  }, [data]);
  useEffect(() => {
    // console.log(currentChat);
    if (!currentChat?.id) return;
    // const localCurrentChat = getLocalStrogeItem("currentChat");
    // console.log(currentChat);
    setNewMessage("");
    setAttachedFiles([]);
    // Check if socket is available, if not, show an alert
    if (!socket) return alert("Socket not available");

    // Emit an event to join the current chat

    socket.emit(ChatEventEnum.JOIN_CHAT_EVENT, currentChat?.id);
  }, [currentChat]);

  const handleMessageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    if (!socket) return;
    if (currentChat?.id) {
      socket.emit(ChatEventEnum.TYPING_EVENT, currentChat?.id);
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    const timerLength = 3000;
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit(ChatEventEnum.STOP_TYPING_EVENT, currentChat?.id);
    }, timerLength);
  };
  const sendMessage = async () => {
    const formData = new FormData();
    formData.append("content", newMessage);
    attachmentFiles.map((file: File) => formData.append("attachments", file));
    console.log("jhgfchjgfhjk");

    // formData.append("attachments", attachmentFiles)
    mutateAsync({ chatId: currentChat?.id!, formData }).then((res) => {
      console.log(res.data);
      if (res.data.data) {
        setMessage(res.data?.data);
        updateChatLastMessage(res.data.data);
      }
      setNewMessage("");
      setAttachedFiles([]);
    });
  };
  return (
    <>
      {currentChat?.id ? (
        <>
          <MessageHeader />
          <div
            style={{
              // backgroundImage: ` linear-gradient(to bottom, #c7e0a4, #a1d263, #83c43d)`,
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "repeat-x",
              // width: "10",
              // opacity: 0.3,
            }}
            className="px-5 h-[calc(100vh-120px)] overflow-y-auto py-3 relative  "
          >
            {/* <div className="absolute inset-0 bg-[url('https://telegram.org/img/tgme/pattern.svg')] bg-cover bg-center"></div> */}
            {/* <div className="absolute inset-0 bg-gradient-to-b from-[#d3e8b8] to-[#a8d27a] z-0"></div> */}
            <Messages />
          </div>
          <div className="sticky top-full px-2 flex justify-between bg-gray-100/50 items-center w-full gap-2 border-t-[0.1px] border-secondary">
            <div className="flex w-full gap-2 items-center">
              <input
                hidden
                id="attachments"
                type="file"
                value=""
                multiple
                accept="image/*"
                max={5}
                onChange={(e) => {
                  if (e.target.files) {
                    setAttachedFiles([...e.target.files]);
                  }
                }}
              />
              <label htmlFor="attachments" className="p-4 cursor-pointer">
                {/* <PaperClipIcon className="w-6 h-6" /> */} <GrAttachment />
              </label>
              <div className="grow  border-x-[0.1px]">
                <input
                  placeholder="Message"
                  className="outline-none px-3 w-full h-full border-none bg-transparent "
                  value={newMessage}
                  // onChange={(e) => {
                  //   setNewMessage(e.target.value);
                  // }}
                  onChange={handleMessageInput}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      newMessage && sendMessage();
                    }
                  }}
                />
              </div>
              <div className="p-">
                <button
                  onClick={sendMessage}
                  disabled={!newMessage && attachmentFiles.length === 0}
                  // variant="ghost"
                  className=" p-4 inline-flex items-center justify-center"
                >
                  {/* <PaperAirplaneIcon className="w-6 h-6" /> */}
                  <BsFillSendFill size={25} />
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div></div>
      )}
    </>
  );
};

export default memo(MessageWrapper);
