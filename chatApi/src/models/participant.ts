import { DataTypes, ModelDefined, Optional } from "sequelize";
import { sequelize } from "../db/dbconfig";
import { User, UserAttributes } from "./User";
// import Conversation from "./Conversation";
import Avatar from "./Avatar";
import { Conversation } from "./Conversation";

type participantType = {
  id: number;
  user_id: number;
  chat_id: number;
  createdAt?: Date;
  updatedAt?: Date;
  user?: UserAttributes;
};

const Participant: ModelDefined<
  participantType,
  Optional<participantType, "id">
> = sequelize.define(
  "participant",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    chat_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "conversations",
        key: "id",
      },
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["user_id", "chat_id"],
      },
    ],
  }
);
Participant.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});
// Participant.belongsTo(Conversation, {
//   foreignKey: "chat_id",
//   as: "chat",
// });
Participant.sync({
  alter: false,
});
export const createParticipant = async (users: number[], chatId: number) => {
  const bulkParticipantsData = users.map((userId) => ({
    user_id: userId,
    chat_id: chatId,
  }));
  const participants = await Participant.bulkCreate(bulkParticipantsData);
  // return await Promise.all(
  //   users.map(async (userId) => {
  //     return await Participant.create({
  //       user_id: userId,
  //       chat_id: chatId,
  //     });
  //   })
  // );
  return participants;
};
export const getChatParticipants = async (chatId: number) => {
  const participants = await Participant.findAll({
    where: { chat_id: chatId },
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
  });
  const plainParticipants = participants.map((participant) =>
    participant.get({ plain: true })
  );
  return plainParticipants;
};
export const getUserParticipants = async (userId: number) => {
  const participants = await Participant.findAll({
    where: { user_id: userId },
    // include: [
    //   {
    //     model: User,
    //     as: "user",
    //     include: [
    //       {
    //         model: Avatar,
    //         as: "avatar",
    //         attributes: ["id", "url"],
    //       },
    //     ],
    //     attributes: ["id", "name", "email"],
    //   },
    // ],
  });
  const plainParticipants = participants.map((participant) =>
    participant.get({ plain: true })
  );
  return plainParticipants;
};
export default Participant;
