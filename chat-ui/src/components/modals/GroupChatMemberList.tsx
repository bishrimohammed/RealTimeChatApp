import { useGetChatParticipants } from "@/hooks/chat";
import { ChatItemInterface } from "@/Interfaces/types";
import { useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import InfiniteScrooler from "../InfiniteScrooler";
import { Button } from "../ui/button";
import AddChatParticipant from "./chat/AddChatParticipant";
import { useAuth } from "@/store/AuthContext";
const GroupChatMemberList = ({
  chat,
  showProfile,
}: {
  chat: ChatItemInterface;
  showProfile: (open: boolean) => void;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const { data, fetchNextPage, isFetchingNextPage, isLoading } =
    useGetChatParticipants(chat.id);

  const users = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) || [];
  }, [data]);
  const user = useAuth((state) => state.user);
  return (
    <>
      <div className="space-y-2 bg-white p-4 min-h-[300px]">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Members</h3>
          {user?.id === chat.admin && (
            <Button
              onClick={() => {
                setOpen(true);
                //   showProfile(false); // close profile when adding a member
              }}
              variant={"ghost"}
            >
              Add member
            </Button>
          )}
        </div>
        <InfiniteScrooler fetchNextPage={fetchNextPage}>
          {isLoading
            ? Array.from({ length: 5 }).map((_, index) => (
                <UserSkeleton key={index} />
              ))
            : users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center space-y-2 py-2 gap-3 group"
                >
                  <Avatar>
                    <AvatarImage src={user?.avatar?.url} alt="Image" />
                    <AvatarFallback>
                      {user.name[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-2">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
              ))}
          {isFetchingNextPage && <p className="f text-center">loading...</p>}
        </InfiniteScrooler>
      </div>
      {open && <AddChatParticipant chat={chat} open={open} setOpen={setOpen} />}
    </>
  );
};

const UserSkeleton = () => {
  return (
    <div className="flex items-center space-y-2 py-2 gap-3 animate-pulse">
      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
      <div className="ml-2">
        <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
        <div className="h-3 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  );
};

export default GroupChatMemberList;
