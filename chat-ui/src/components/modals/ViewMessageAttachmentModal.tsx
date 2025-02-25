import { attachmentInterface } from "@/Interfaces/types";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

// import { Dialog ,DialogTitle,DialogContent,DialogDescription, DialogHeader} from "./ui/dialog";
type propsTypes = {
  open: boolean;
  setOpen: (open: boolean) => void;
  attachments: attachmentInterface[];
  currentImage: number;
};
const ViewMessageAttachmentModal = ({
  setOpen,
  open,
  attachments,
  currentImage,
}: propsTypes) => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-6xl h-screen  border border-red-700  my-5 ">
        {/* <DialogHeader>
          <DialogTitle>{}</DialogTitle>
          {<DialogDescription>{}</DialogDescription>}
        </DialogHeader> */}
        <div className="mx-auto w-full relative mt-6 flex justify-center items-center">
          <Carousel
            setApi={setApi}
            className=" h-[100%] w-[90%]   items-center justify-center "
          >
            <CarouselContent className="h-[60]   max-w-[100%]  w-[100%] items-center">
              {attachments.map((attachment, index) => (
                <CarouselItem key={index} className=" h-[550px] max-w-[100%]">
                  {/* <div className="h-full border border-red-600"> */}
                  <img
                    className="w-full h-full object-contain object-center"
                    src={attachment.url}
                    alt="attachment"
                  />
                  {/* </div> */}
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="sm:flex hidden" />
            <CarouselNext className="sm:flex hidden" />
          </Carousel>
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

export default ViewMessageAttachmentModal;
