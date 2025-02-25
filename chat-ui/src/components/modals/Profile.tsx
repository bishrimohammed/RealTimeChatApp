import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChatItemInterface } from "@/Interfaces/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getChatObjectMetadata } from "@/lib/utils";
import { useAuth } from "@/store/AuthContext";

import GroupChatMemberList from "./GroupChatMemberList";

type propsTypes = {
  open: boolean;
  setOpen: (open: boolean) => void;
  chat: ChatItemInterface;
};
const ProfileModal = ({ open, setOpen, chat }: propsTypes) => {
  const user = useAuth((state) => state.user);
  // const { data, fetchNextPage, isFetchingNextPage, isLoading } =
  //   useGetChatParticipants(chat.id);

  // const users = useMemo(() => {
  //   return data?.pages.flatMap((page) => page.data) || [];
  // }, [data]);
  // console.log(chat);
  // const hand

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>
            {chat.isGroup ? "Group Info" : "User Info"}{" "}
          </DialogTitle>
          <DialogDescription>{}</DialogDescription>
        </DialogHeader>
        <div className="bg-gray-100 ">
          <hr />
          <div className="max-h-[500px] overflow-y-auto">
            <div className={`p-6 bg-white ${chat.isGroup ? "mb-3" : ""}`}>
              {/* <h3 className="text-lg font-semibold mb-4">{chat.name}</h3> */}
              <div className="flex items-center gap-5 text-gray-600">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={getChatObjectMetadata(chat, user!).avatar?.url}
                    alt="avatar"
                  />
                  <AvatarFallback>
                    {getChatObjectMetadata(chat, user!)
                      .title.charAt(0)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold">
                    {getChatObjectMetadata(chat, user!).title}
                  </h3>
                  {chat.isGroup ? (
                    <p className="flex items-center gap-2 text-gray-600 text-sm">
                      30 members
                    </p>
                  ) : (
                    <p className="flex items-center gap-2 text-gray-600 text-sm">
                      {
                        chat.participants.find((p) => p.user_id !== user?.id)
                          ?.user.email
                      }
                    </p>
                  )}
                </div>
              </div>
            </div>
            {chat.isGroup && (
              <GroupChatMemberList chat={chat} showProfile={setOpen} />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
