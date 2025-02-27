import { DataTypes, ModelDefined, Optional } from "sequelize";
import { sequelize } from "../db/dbconfig";

export type avatarAttributes = {
  id: number;
  url: string;
  localPath: string;
  user_id: number | null;
  chat_id: number | null;
  createdAt?: Date;
  updatedAt?: Date;
};

const Avatar: ModelDefined<
  avatarAttributes,
  Optional<avatarAttributes, "id">
> = sequelize.define("avatar", {
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
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  chat_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

export default Avatar;
