import { getChatObjectMetadata, removeLocalStrogeItem } from "@/lib/utils";
import { useAuth } from "@/store/AuthContext";
import { useChat } from "@/store/ChatStore";
// import { Avatar } from "@radix-ui/react-avatar";
import { memo, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import ProfileModal from "./modals/Profile";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { BsThreeDotsVertical } from "react-icons/bs";
import { ChatItemInterface } from "@/Interfaces/types";

const MessageHeader = () => {
  const user = useAuth((state) => state.user);
  const currentChat = useChat((state) => state.currentChat);
  const typingEffect = useChat((state) => state.typingEffect);
  const [open, setOpen] = useState(false);
  // console.log("message h");

  return (
    <>
      <div className="py-2 px-4 mb-2 cursor-pointer sticky top-0 bg-dark z-20 flex justify-between items-center w-full border-b-[0.1px] border-secondary">
        <div
          onClick={() => setOpen(true)}
          className="flex justify-start items-center w-max gap-3 px-2"
        >
          <div
            className="sm:hidden block p-1"
            onClick={() => {
              useChat.setState((prev) => ({ ...prev, currentChat: null }));
              removeLocalStrogeItem("currentChat");
              // resetCurrentChat();
            }}
          >
            <FaArrowLeftLong
              size={25}
              // color="#0f172f"
              className="text-slate-700"
            />
          </div>
          <Avatar>
            <AvatarImage
              src={getChatObjectMetadata(currentChat!, user!).avatar?.url}
              alt="avatar"
            />
            <AvatarFallback>
              {getChatObjectMetadata(currentChat!, user!)
                .title.charAt(0)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="w-full flex flex-col ">
            <p className="text-sm truncate-1 font-medium text-slate-900">
              {/* User Name */}
              {getChatObjectMetadata(currentChat!, user!).title}
            </p>
            <div className="w-full inline-flex items-center text-left">
              <p className="text-xs truncate-1 text-slate-500   text-ellipsis inline-flex items-center">
                {typingEffect.isTyping &&
                typingEffect.chatId === currentChat?.id
                  ? "typing"
                  : "  Last Active: 10:00"}
              </p>
            </div>
          </div>
        </div>
        {/* <FaUserDoctor className="z-30" /> */}
        <MessageHeaderDropDown chat={currentChat!} />
      </div>
      {open && (
        <ProfileModal open={open} setOpen={setOpen} chat={currentChat!} />
      )}
    </>
  );
};

const MessageHeaderDropDown = ({ chat }: { chat: ChatItemInterface }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <BsThreeDotsVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="me-3">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          {/* <DropdownMenuSeparator /> */}
          <DropdownMenuItem onClick={() => setOpen(true)}>
            Leave group
          </DropdownMenuItem>
          {/* <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Team</DropdownMenuItem>
        <DropdownMenuItem>Subscription</DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={open} onOpenChange={setOpen}>
        {/* <AlertDialogTrigger asChild>
        <Button variant="outline">Show Dialog</Button>
      </AlertDialogTrigger> */}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default memo(MessageHeader);
