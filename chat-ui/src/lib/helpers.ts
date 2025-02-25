import { differenceInDays, format, isSameYear } from "date-fns";
export const formatLastChatMessageDate = (lastMessageTimestamp: string) => {
  const now = new Date();
  const lastMessageDate = new Date(lastMessageTimestamp.slice(0, 10));
  const dayDiff = differenceInDays(now, lastMessageDate);
  //   console.log("different is " + dayDiff);
  if (isSameYear(lastMessageDate, now)) {
    if (dayDiff === 0) {
      // console.log("different is " + dayDiff);

      return format(lastMessageTimestamp, "h:mm a");
    } else if (dayDiff === 1) {
      //   console.log("different is " + dayDiff);
      return "yesterday";
    } else if (dayDiff < 7 && dayDiff > 1) {
      //   console.log("different is " + dayDiff);
      return format(lastMessageTimestamp, "eee");
    } else {
      //   console.log("different is " + dayDiff);
      return format(lastMessageTimestamp, "MMM dd");
    }
  } else {
    // console.log("different is " + dayDiff);
    return format(lastMessageTimestamp, "yyyy-MM-dd");
  }
};
