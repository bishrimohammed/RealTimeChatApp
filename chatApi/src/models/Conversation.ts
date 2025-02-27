import { DataTypes, ModelDefined, Optional } from "sequelize";
import { sequelize } from "../db/dbconfig";
import Message from "./Message";
import { User } from "./User";
import Participant from "./participant";
import Avatar from "./Avatar";

type ConversationAttributes = {
  id: number;
  name?: string;
  isGroup?: boolean;
  user1?: number;
  user2?: number;
  lastMessage_id: number | null;
  avatar_id: number | null;
  admin?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
};
type ConversationCreationAttributes = Optional<ConversationAttributes, "id">;

const Conversation: ModelDefined<
  ConversationAttributes,
  ConversationCreationAttributes
> = sequelize.define("Conversation", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "1 to 1 chat",
  },
  isGroup: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  user1: {
    type: DataTypes.INTEGER,
    allowNull: true,
    // references: { model: "users", key: "id" },
    onDelete: "SET NULL",
    onUpdate: "SET NULL",
    // references: { model: "users", key: "id" },
  },
  user2: {
    type: DataTypes.INTEGER,
    allowNull: true,
    onDelete: "SET NULL",
    onUpdate: "SET NULL",
    // references: { model: "users", key: "id" },
  },
  lastMessage_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: "messages", key: "id" },
    defaultValue: null,
  },
  avatar_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: "avatars", key: "id" },
    defaultValue: null,
  },
  admin: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null, // or null if you want to allow null values
    references: {
      model: "users",
      key: "id",
    },
  },
});

Conversation.belongsTo(User, {
  foreignKey: "user1",
  as: "userOne",
});

Conversation.belongsTo(User, {
  foreignKey: "user2",
  as: "userTwo",
});
Conversation.hasMany(Message, {
  foreignKey: "conversation_id",
  as: "messages",
});
Conversation.hasMany(Participant, {
  foreignKey: "chat_id",
  as: "participants",
});
Conversation.belongsTo(Message, {
  foreignKey: "lastMessage_id",
  as: "lastMessage", // change to 'messages' if you want to use this name in your code
});
Conversation.belongsTo(Avatar, {
  foreignKey: "chat_id",
  as: "avatar",
});
Conversation.sync({ alter: false });

const getChatDetails = async (chatId: number) => {
  const chat = await Conversation.findOne({
    where: { id: chatId },
    include: [
      {
        model: Message,
        as: "lastMessage",
        include: [
          {
            model: User,
            as: "sender",

            attributes: ["id", "name", "email"],
          },
        ],
      },
      {
        model: Participant,
        as: "participants",
        include: [
          {
            model: User,
            as: "user",
            include: [
              {
                model: Avatar,
                as: "avatar",
                attributes: ["id", "url"],
              },
            ],
            attributes: ["id", "name", "email"],
          },
        ],
        limit: 3,
      },
    ],
    // raw: true,
  });
  return chat;
};
export { Conversation, getChatDetails };
