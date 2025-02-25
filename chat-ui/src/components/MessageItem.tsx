import { attachmentInterface, messageItemInterface } from "@/Interfaces/types";
// import { formatLastChatMessageDate } from "@/lib/helpers";
import { format } from "date-fns";
import React, { memo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import ViewMessageAttachmentModal from "./modals/ViewMessageAttachmentModal";
// import { DialogTitle } from "@radix-ui/react-dialog";
type propsTypes = {
  isOwnMessage: boolean;
  message: messageItemInterface;
  isPreviousMessageFromSameSender: boolean;
};
const MessageItem: React.FC<propsTypes> = ({
  isOwnMessage,
  message,
  isPreviousMessageFromSameSender,
}) => {
  // console.log("mmmmm");
  return (
    <div className={`flex gap-3  ${isOwnMessage ? "self-end" : "self-start"} `}>
      {/* <div
        className={`flex justify-center self-end items-center flex-shrink-0 ${
          isOwnMessage ? "order-2" : "order-1"
        } `}
      > */}
      {isPreviousMessageFromSameSender ? (
        <div
          className={`self-end w-10 h-10 sm:block hidden  ${
            isOwnMessage ? "order-2" : "order-1"
          }`}
        ></div>
      ) : (
        <Avatar
          className={`self-end sm:block hidden ${
            isOwnMessage ? "order-2" : "order-1"
          }`}
        >
          <AvatarImage src={message.sender.avatar?.url} alt="avatar" />
          <AvatarFallback>
            {message.sender.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={`max-w-md rounded-lg shadow-md rounded-bl-none relative  ${
          isOwnMessage
            ? "order-1 bg-[#dcf8c6] dark:bg-[#202c33]"
            : "order-2 bg-[#e4f3da] dark:bg-[#1e1e1e]"
        } `}
      >
        {message.hasAttachments && (
          <MessageAttachments attachments={message.attachments} />
        )}
        {message.content ? (
          <div className="relative p-2 pl-2.5 ">
            <p className="w-full inline-flex flex-wr gap-2 justify-between">
              <span className="grow text-black"> {message.content}</span>

              <span className="opacity-60 text-[9px] self-end justify-end items-end inline text-nowrap">
                {format(message.createdAt, "h:mm a")}
              </span>
            </p>
            {/* <div className="right-2 bottom-1 absolute opacity-60 text-[9px] flex gap-[3px]">
              <p className="">
               
                {format(message.createdAt, "h:mm a")}
                
              </p>
            </div> */}
          </div>
        ) : (
          <div className="right-2 bottom-2 absolute px-2 py-0.5 rounded-xl bg-black opacity-60 text-[9px] flex gap-[3px]">
            <p className="text-white">
              {/* message send time */}
              {/* 12:40 PM */}
              {format(message.createdAt, "h:mm a")}
              {/* <span className="">{format(message.createdAt, "h:mm a")}</span> */}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const MessageAttachments = ({
  attachments,
}: {
  attachments: attachmentInterface[];
}) => {
  const [open, setOpen] = useState(false);
  const fileLength = attachments.length;
  // console.log(attachments);
  const onImageClick = (index?: number) => {
    setOpen(true);
    //  const attachment = attachments[index?? 0];
    //  console.log(attachment);
  };
  const getAtt = () => {
    if (fileLength === 1) {
      const attachment = attachments[0];
      return (
        <div
          onClick={() => {
            onImageClick(0);
          }}
          className={`p-0.5 rounded-xl max-h-52  overflow-hidden 
        
      `}
        >
          <img
            src={attachment.url}
            alt=""
            className="w-full h-full object-contain object-center"
          />
        </div>
      );
    } else if (fileLength === 2) {
      return (
        <div className="flex  overflow-hidden p-0.5">
          {attachments?.map((attachment, index) => {
            return (
              <div
                onClick={() => {
                  onImageClick(index);
                }}
                key={attachment.id}
                className={`p-0.5 rounded-xl  max-h-52 w-1/2 overflow-hidden 
             `}
              >
                <img
                  src={attachment.url}
                  alt=""
                  className="w-full h-full object-fill object-center"
                />
              </div>
            );
          })}
        </div>
      );
    } else if (fileLength === 3) {
      return (
        <div className="inline-flex flex-wrap  overflow-hidden p-0.5 ">
          {attachments?.map((attachment, index) => {
            return (
              <div
                onClick={() => {
                  onImageClick(index);
                }}
                key={attachment.id}
                className={`p-0.5 rounded-xl ${
                  index === 0 ? "flex-grow" : "w-1/2"
                }  max-h-52  overflow-hidden 
             `}
              >
                <img
                  src={attachment.url}
                  alt=""
                  className="w-full h-full object-cover object-center"
                />
              </div>
            );
          })}
        </div>
      );
    } else if (fileLength === 4) {
      return (
        <div className="inline-flex flex-wrap  overflow-hidden p-0.5 ">
          {attachments?.map((attachment, index) => {
            return (
              <div
                onClick={() => {
                  onImageClick(index);
                }}
                key={attachment.id}
                className={`p-0.5 rounded-xl  max-h-52 w-1/2 overflow-hidden 
             `}
              >
                <img
                  src={attachment.url}
                  alt=""
                  className="w-full h-full object-cover object-center"
                />
              </div>
            );
          })}
        </div>
      );
    } else {
      return (
        <div className="inline-flex flex-wrap  overflow-hidden p-0.5 relative">
          {attachments?.slice(0, 4)?.map((attachment, index) => {
            return (
              <div
                onClick={() => {
                  onImageClick(index);
                }}
                key={attachment.id}
                className={`p-0.5 rounded-xl  max-h-52 w-1/2 overflow-hidden 
             `}
              >
                <img
                  src={attachment.url}
                  alt=""
                  className="w-full h-full object-cover object-center"
                />
              </div>
            );
          })}
          <div
            onClick={() => {
              onImageClick(4);
            }}
            className="absolute text-white  bottom-0 right-0 text-4xl cursor-pointer bg-black bg-opacity-40 h-52 w-1/2 flex justify-center items-center"
          >
            +2
          </div>
        </div>
      );
    }
  };
  return (
    <>
      {getAtt()}
      {open && (
        <ViewMessageAttachmentModal
          open={open}
          setOpen={setOpen}
          attachments={attachments}
          currentImage={1}
        />
      )}
    </>
  );
};
export default memo(MessageItem);
