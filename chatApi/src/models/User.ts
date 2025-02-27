import { DataTypes, Model, ModelDefined, Optional } from "sequelize";
import { sequelize } from "../db/dbconfig";
import Avatar, { avatarAttributes } from "./Avatar";
export type UserAttributes = {
  id: number;
  name: string;
  email: string;
  password: string;
  last_avatar?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
  avatar: avatarAttributes | null;
  login_type?: string;

  // login_type?: "EMAIL_PASSWORD" | "GOOGLE" | "FACEBOOK";
};
type UserCreationAttributes = Optional<UserAttributes, "id">;
const User: ModelDefined<UserAttributes, UserCreationAttributes> =
  sequelize.define("user", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_avatar: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "avatars", key: "id" },
      defaultValue: null,
    },
    login_type: {
      type: DataTypes.ENUM,
      values: ["EMAIL_PASSWORD", "GOOGLE", "FACEBOOK"],
      defaultValue: "EMAIL_PASSWORD",
    },
  });
User.sync({ alter: false, force: false });
User.hasMany(Avatar, {
  foreignKey: "user_id",
  as: "avatars",
});

User.belongsTo(Avatar, {
  foreignKey: "last_avatar",
  as: "avatar",
});
export const getUserById = async (id: number) => {
  return await User.findByPk(id, {
    include: { model: Avatar, as: "avatar", attributes: ["id", "url"] },
  });
};
export const getUserByEmail = async (email: string) => {
  return await User.findOne({
    where: { email: email },
    include: { model: Avatar, as: "avatar", attributes: ["id", "url"] },
  });
};
export { User };
