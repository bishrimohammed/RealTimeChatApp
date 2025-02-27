import { DataTypes, ModelDefined, Optional } from "sequelize";
import { sequelize } from "../db/dbconfig";
import { User } from "./User";
import Attachment, { attachmentAttributes } from "./Attachment";
import Avatar from "./Avatar";
type MessageAttributes = {
  id: number;
  conversation_id: number;
  sender_id: number;
  content: string;
  hasAttachments?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  attachments?: attachmentAttributes[];
};
type MessageCreationAttributes = Optional<MessageAttributes, "id">;

const Message: ModelDefined<MessageAttributes, MessageCreationAttributes> =
  sequelize.define("message", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    conversation_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "conversations",
        key: "id",
      },
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    content: { type: DataTypes.STRING, allowNull: false },
    hasAttachments: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });
Message.belongsTo(User, {
  foreignKey: "sender_id",
  as: "sender",
});
Message.hasMany(Attachment, {
  foreignKey: "message_id",
  as: "attachments",
});
export const getMessageWithDetailsById = async (messageId: number) => {
  const message = await Message.findByPk(messageId, {
    include: [
      {
        model: User,
        as: "sender",
        include: [
          {
            model: Avatar,
            as: "avatar",
            attributes: ["id", "url"],
          },
        ],
        attributes: ["id", "name", "email"],
      },
      {
        model: Attachment,
        as: "attachments",
      },
    ],
  });
  return message;
};
Message.sync({ alter: false });
export default Message;
