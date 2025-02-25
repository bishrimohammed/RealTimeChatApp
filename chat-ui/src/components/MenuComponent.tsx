import { useState } from "react";
import { Button } from "@/components/ui/button";

import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FaUserGroup, FaPlus } from "react-icons/fa6";
import { useAuth } from "@/store/AuthContext";
import Modal from "./modals/Modal";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const MenuComponent = () => {
  const logout = useAuth((state) => state.logout);
  const user = useAuth((state) => state.user);
  const [open, setOpen] = useState<boolean>(false);
  const [modal, setModal] = useState<{
    title: string;
    target: string;
    description?: string;
    open: boolean;
  }>({ target: "", title: "", description: "", open: false });
  const handleOpenModal = (
    title: string,
    target: string,
    description?: string
  ) => {
    setModal({ target, title, description, open: true });
    setOpen(false);
  };
  const handleCloseModal = (open: boolean) => {
    setModal({ target: "", title: "", description: "", open: open });
  };

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <HamburgerMenuIcon className="cursor-pointer" />
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[300px] p-0">
          <SheetHeader className="px-6 py-3">
            <SheetTitle>
              <Avatar className="w-12 h-12">
                <AvatarImage src={user?.avatar?.url} alt="Image" />
                <AvatarFallback>
                  {user?.name?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </SheetTitle>
            <SheetDescription className="text-start">
              {/* <span className="text-start"></span> */}
              {user?.name}
            </SheetDescription>
          </SheetHeader>
          <hr />
          <div className="flex flex-col  mt-3  md:h-[81%] h-[85%]">
            <div className="space-y-1 grow">
              <div
                onClick={() => {
                  handleOpenModal("Create Group", "group");
                }}
                className="flex items-center  py-2 gap-4 hover:bg-gray-200 px-6 cursor-pointer"
              >
                <FaUserGroup size={19} color="#374151" />
                <p className="text-gray-950 font-semibold text-sm">New Group</p>
              </div>
              <div className="flex items-center  py-2 gap-4 hover:bg-gray-200 px-6 cursor-pointer">
                <FaUserGroup size={19} color="#374151" />
                <p className="text-gray-950 font-semibold text-sm">Channels</p>
              </div>
              <div
                onClick={() => {
                  handleOpenModal("Create Chat", "chat");
                }}
                className="flex items-center  py-2 gap-4 hover:bg-gray-200 px-6 cursor-pointer"
              >
                <FaPlus size={19} color="#374151" />
                <p className="text-gray-950 font-semibold text-sm">Add Chat</p>
              </div>
            </div>
            <div className="px-6">
              <Button
                onClick={logout}
                size={"sm"}
                variant={"outline"}
                className="w-full"
              >
                Logout
              </Button>
            </div>
          </div>
          {/* <SheetFooter className="mt-auto">
            <Button onClick={logout}>Logout</Button>
            <SheetClose asChild>
              <Button onClick={logout}>Logout</Button>
            </SheetClose>
          </SheetFooter> */}
        </SheetContent>
      </Sheet>
      {modal.open && (
        <Modal
          target={modal.target}
          open={modal.open}
          title={modal.title}
          setOpen={handleCloseModal}
        />
      )}
    </>
  );
};

export default MenuComponent;
