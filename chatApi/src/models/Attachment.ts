import { DataTypes, ModelDefined, Optional } from "sequelize";
import { sequelize } from "../db/dbconfig";

export type attachmentAttributes = {
  id: number;
  url: string;
  localPath: string;
  message_id: number;
  createdAt?: Date;
  updatedAt?: Date;
};

const Attachment: ModelDefined<
  attachmentAttributes,
  Optional<attachmentAttributes, "id">
> = sequelize.define("attachment", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  localPath: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  message_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "messages",
      key: "id",
    },
  },
});

export default Attachment;
