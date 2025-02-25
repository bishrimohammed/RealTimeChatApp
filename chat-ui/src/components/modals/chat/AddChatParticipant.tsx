import { ChatItemInterface, UserInterface } from "@/Interfaces/types";
import UserSkeleton from "@/components/Skeleton/UserSkeleton";
import { AlertDialogFooter } from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useAddChatParticipants,
  useGetUsersNotMemberOfChat,
} from "@/hooks/chat";
import { toast } from "@/hooks/use-toast";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import { useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
type propsTypes = {
  open: boolean;
  setOpen: (open: boolean) => void;
  chat: ChatItemInterface;
};
const AddChatParticipant = ({ open, setOpen, chat }: propsTypes) => {
  const { data, isLoading, fetchNextPage, isFetchingNextPage } =
    useGetUsersNotMemberOfChat(chat.id);
  const [selectedUsers, setSelectedUsers] = useState<UserInterface[]>([]);
  const users = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) || [];
  }, [data]);

  const { mutateAsync, isPending, error, isSuccess, isError } =
    useAddChatParticipants();
  const { ref, inView } = useInView({
    threshold: 0,
    onChange: (inView) => {
      console.log(inView);

      if (inView) {
        fetchNextPage();
      }
    },
  });
  const handleAddParticipant = () => {
    // console.log(selectedUsers);
    const members = selectedUsers.map((user) => user.id);
    mutateAsync({ chatId: chat.id, members })
      .then((res) => {
        toast({ description: "Success" });
        setOpen(false);
      })
      .catch((err) => {
        toast({ description: `Error ${err.error!}`, variant: "destructive" });
      });
    // if (isError) {
    //   console.log(error);
    // }
    // if (isSuccess) {
    //   toast({ description: "Success" });
    // }
    // send request to add participants to chat
  };
  function getUserList() {
    return users?.map((user) => (
      <CommandItem
        key={user.email}
        className="flex items-center px-2"
        onSelect={() => {
          if (selectedUsers.includes(user)) {
            return setSelectedUsers(
              selectedUsers.filter((selectedUser) => selectedUser !== user)
            );
          }

          return setSelectedUsers(
            [...users].filter((u) => [...selectedUsers, user].includes(u))
          );
        }}
      >
        <Avatar>
          <AvatarImage src={user?.avatar?.url} alt="Image" />
          <AvatarFallback>{user.name[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="ml-2">
          <p className="text-sm font-medium leading-none">{user.name}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        {selectedUsers.includes(user) ? (
          <CheckCircledIcon className="ml-auto flex h-5 w-5 text-primary" />
        ) : null}
      </CommandItem>
    ));
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Add Participants to {chat.name}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="bg-gray00 bg-white ">
          {/* <hr /> */}
          <Command className="overflow-hidden rounded-t-none border-t bg-transparent mt-2">
            {/* <CommandInput placeholder="Search user..." /> */}
            <CommandList>
              <CommandEmpty>No users found.</CommandEmpty>
              <CommandGroup className="p-2">
                {isLoading
                  ? Array.from({ length: 5 }).map((_, index) => (
                      <UserSkeleton key={index} />
                    ))
                  : getUserList()}
                {isFetchingNextPage && (
                  <p className="f text-center">loading...</p>
                )}
                <div ref={ref}></div>
              </CommandGroup>
            </CommandList>
            <AlertDialogFooter className="flex items-center border-t p-4 sm:justify-between">
              {selectedUsers.length > 0 ? (
                <div className="flex -space-x-2 overflow-hidden">
                  {selectedUsers.map((user) => (
                    <Avatar
                      key={user.email}
                      className="inline-block border-2 border-background"
                    >
                      <AvatarImage src={user.avatar?.url} />
                      <AvatarFallback>
                        {user.name[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Select users to add to this thread.
                </p>
              )}
              <Button
                disabled={selectedUsers.length < 1 || isPending}
                onClick={() => {
                  // setOpen(false);
                  handleAddParticipant();
                }}
                // form="formId"
                // type="submit"
              >
                Continue
              </Button>
            </AlertDialogFooter>
          </Command>
          {/* {isLoading
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
          {isFetchingNextPage && <p className="f text-center">loading...</p>} */}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddChatParticipant;
