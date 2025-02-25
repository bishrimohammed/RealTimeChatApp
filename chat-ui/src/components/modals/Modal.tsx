import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useGetUsers } from "@/hooks/useGetUsers";
import { useDebounce } from "@/hooks/useDebounce";
import { Skeleton } from "../ui/skeleton";
import { useCreateOrGet1to1Chat } from "@/hooks/chat";
import { toast } from "@/hooks/use-toast";
import { useChat } from "@/store/ChatStore";
import { ChatItemInterface, UserInterface } from "@/Interfaces/types";
import { Icons } from "../icons";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import { AlertDialogFooter } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { useCreateGroupChat } from "@/hooks/useCreateGroupChat";
type propsTypes = {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  description?: string;
  target: string;
};
const Modal: React.FC<propsTypes> = ({
  open,
  setOpen,
  title,
  description,
  target,
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="mt-2">
          {target === "chat" && <AddChat setOpen={setOpen} />}
          {target === "group" && <AddGroup setOpen={setOpen} />}
        </div>

        {/* <DialogFooter className="sm:justify-start">
          <Button
            type="button"
            onClick={() => setOpen(false)}
            variant="secondary"
          >
            Close
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
};

const AddChat = ({ setOpen }: { setOpen: (open: boolean) => void }) => {
  const [search, setSearch] = useState("");
  const deboumcedValue = useDebounce(search, 3000);
  console.log(deboumcedValue);

  const { data, isPending, isFetching } = useGetUsers(deboumcedValue);
  const createChat = useCreateOrGet1to1Chat();
  console.log(data);

  return (
    <div>
      <div className="flex flex-col gap-2">
        {" "}
        <Label htmlFor="search">Search User</Label>{" "}
        <Input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="search"
          id="search"
        />
      </div>
      <div className="max-h-[200px] overflow-y-auto my-2 relative z-10">
        {/* {Array.from({ length: 30 }).map((_, i) => {
          return <p key={i}>Title {i}</p>;
        })} */}
        {!isPending &&
          data?.data?.map(
            (user: { id: number; name: string; email: string }) => (
              <div
                role="button"
                onClick={() => {
                  createChat
                    .mutateAsync(user.id)
                    .then((res) => {
                      const chat = res.data?.data as ChatItemInterface;
                      const chatExist = useChat
                        .getState()
                        .chats.find((c) => c.id === chat.id);

                      useChat.setState((prev) => {
                        if (chatExist) {
                          return {
                            ...prev,
                            currentChat: chat,
                          };
                        }
                        return {
                          ...prev,
                          chats: [chat, ...prev.chats],
                          currentChat: chat,
                        };
                      });
                      setOpen(false);
                    })
                    .catch((err) => {
                      toast({
                        description: "SomeThing went wrong",
                      });
                    });
                }}
                key={user.id}
                className="flex justify-start items-center  gap-2 py-2 hover:bg-slate-200 cursor-pointer"
              >
                <div className="w-7 h-7 bg-slate-500 rounded-full flex items-center justify-center text-white">
                  {/* User Avatar */}
                  <p className="text-lg">{user.name.charAt(0).toUpperCase()}</p>
                </div>
                <p className="text-sm truncate-1 font-medium text-slate-900">
                  {/* User Name */}
                  {user.name}
                </p>
              </div>
            )
          )}
        {createChat.isPending && (
          <div className="h-full absolute top-0 w-full bg-transparent flex items-center justify-center">
            <div className="border p-2 rounded-xl ">
              <Icons.spinner className="size-7 animate-spin" />
            </div>
          </div>
        )}

        {isFetching && <UserLoadingSkeleton />}
      </div>
    </div>
  );
};

// type User = (typeof users)[number];

const AddGroup = ({ setOpen }: { setOpen: (open: boolean) => void }) => {
  const { data, isPending } = useGetUsers("");
  const [selectedUsers, setSelectedUsers] = React.useState<UserInterface[]>([]);
  const [groupName, setGroupName] = React.useState("");
  const users = data?.data as UserInterface[];
  const { mutateAsync, isPending: createChatPending } = useCreateGroupChat();
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
  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (groupName.trim().length < 3) {
      toast({
        description: "Group name should be at least 3 characters long.",
        variant: "destructive",
      });
      return;
    }
    if (selectedUsers.length < 3) {
      toast({
        description: "Please select at least 3 group members.",
        variant: "destructive",
      });
      return;
    }
    const data = {
      name: groupName.trim(),
      members: selectedUsers.map((user) => user.id),
    };
    console.log(data);
    mutateAsync(data).then((res) => {
      toast({
        description: "Group created successfully",
      });
      const result = res.data?.data;
      useChat.setState((prev) => ({
        ...prev,
        chats: [result, ...prev.chats],
        // currentChat: result,
      }));
      setOpen(false);
    });
    // createGroupChat({
    //   name: groupName,
    //   users: selectedUsers.map((user) => user.email),
    // })
    // .then((res) => {
    //   toast({
    //     description: "Group created successfully",
    //   });
    // }).catch((err) => {
    //   toast({
    //     description: "Some thing went wrong",
    //   });
    // });
    // setSelectedUsers([]);
    // setGroupName("");
  };
  return (
    <div>
      <form onSubmit={submitHandler} id="formId">
        <Label>Group name </Label>
        <Input
          name="name"
          id="name"
          className="mt-2"
          value={groupName}
          onChange={(e) => {
            setGroupName(e.target.value);
          }}
        />
      </form>
      <Label>Select Chat Members </Label>
      <Command className="overflow-hidden rounded-t-none border-t bg-transparent mt-2">
        {/* <CommandInput placeholder="Search user..." /> */}
        <CommandList>
          <CommandEmpty>No users found.</CommandEmpty>
          <CommandGroup className="p-2">
            {isPending ? <UserLoadingSkeleton /> : getUserList()}
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
                  <AvatarFallback>{user.name[0].toUpperCase()}</AvatarFallback>
                </Avatar>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Select users to add to this thread.
            </p>
          )}
          <Button
            disabled={selectedUsers.length < 2}
            onClick={() => {
              // setOpen(false);
            }}
            form="formId"
            type="submit"
          >
            Continue
          </Button>
        </AlertDialogFooter>
      </Command>
    </div>
  );
};

const UserLoadingSkeleton = () => {
  return (
    <>
      <div className="flex justify-start items-center  gap-2 py-2">
        <Skeleton>
          <div className="w-7 h-7 bg-slate-500 rounded-full flex items-center justify-center text-white">
            {/* User Avatar */}
            {/* <p className="text-lg">{user.name.charAt(0).toUpperCase()}</p> */}
          </div>
        </Skeleton>
        <Skeleton>
          <p className="text-sm truncate-1 font-medium w-32 h-4 text-slate-900">
            {/* User Name */}
          </p>
        </Skeleton>
      </div>
      <div className="flex justify-start items-center  gap-2 py-2">
        <Skeleton>
          <div className="w-7 h-7 bg-slate-500 rounded-full flex items-center justify-center text-white">
            {/* User Avatar */}
            {/* <p className="text-lg">{user.name.charAt(0).toUpperCase()}</p> */}
          </div>
        </Skeleton>
        <Skeleton>
          <p className="text-sm truncate-1 font-medium w-32 h-4 text-slate-900">
            {/* User Name */}
          </p>
        </Skeleton>
      </div>
      <div className="flex justify-start items-center  gap-2 py-2">
        <Skeleton>
          <div className="w-7 h-7 bg-slate-500 rounded-full flex items-center justify-center text-white">
            {/* User Avatar */}
            {/* <p className="text-lg">{user.name.charAt(0).toUpperCase()}</p> */}
          </div>
        </Skeleton>
        <Skeleton>
          <p className="text-sm truncate-1 font-medium w-32 h-4 text-slate-900">
            {/* User Name */}
          </p>
        </Skeleton>
      </div>
    </>
  );
};
export default Modal;
