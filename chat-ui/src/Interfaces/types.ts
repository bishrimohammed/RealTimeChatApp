export type UserInterface = {
  id: number;
  name: string;
  email: string;
  avatar: { id: number; url: string } | null;
};
export type attachmentInterface = {
  id: number;
  url: string;
  localPath: string;
  message_id: number;
  createdAt?: Date;
  updatedAt?: Date;
};
export interface ChatItemInterface {
  id: number;
  name: string;
  user1: number;
  user2: number;
  lastMessage_id: number | null;
  admin: number;
  isGroup: boolean;
  createdAt: string;
  updatedAt: string;
  lastMessage: null | messageItemInterface;
  userOne: UserInterface;
  userTwo: UserInterface;
  participants: participantInterface[];
  avatar: AvatarInterface | null;
}
interface AvatarInterface {
  id: number;
  url: string;
}
export interface messageItemInterface {
  id: number;
  conversation_id: number;
  sender_id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  sender: UserInterface;
  hasAttachments: boolean;
  attachments: attachmentInterface[];
}
export interface participantInterface {
  id: number;
  chat_id: number;
  user_id: number;
  user: UserInterface;
}
