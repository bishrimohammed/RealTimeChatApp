declare namespace ModelTypes {
  interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    profile_photo?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  interface Conservation {
    id: number;
    user1: number;
    user2: number;
    createdAt?: Date;
    updatedAt?: Date;
  }
  interface Message {
    id: number;
    conversation_id: number;
    sender_id: number;
    content: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
}
interface ConversationResponseTypes extends ModelTypes.Conservation {
  messages?: ModelTypes.Message[];
}

interface AuthUser {
  id: number;
  name: string;
  email: string;
  profile_photo?: string;
}
declare namespace ResponseTypes {
  interface AuthResponse {
    success: boolean;
    token: string;
    user: AuthUser;
  }
  type ConversationList = ConversationResponseTypes[];
  interface ConversationResponse {
    success: boolean;
    conversations: ConversationResponseTypes[];
  }
  interface MessageResponse {
    success: boolean;
    messages: ModelTypes.Message[];
  }
}
