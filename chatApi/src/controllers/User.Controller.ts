import { getUserByEmail, getUserById, User } from "../models/User";
import { NextFunction, Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/responses";
import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
import { generateToken } from "../utils/generateToken";
import asyncHandler from "express-async-handler";
import { ApiError } from "../utils/ApiError";
import { Op } from "sequelize";
import Avatar from "../models/Avatar";
import { getLocalPath, getStaticFilePath } from "../utils/helpers";
import Participant from "../models/participant";
const UserController = {
  getUsers: async (
    req: Request<{}, {}, {}, { q: string }>,
    res: Response
  ): Promise<any> => {
    // req.query.
    let where: any = {};
    if (req.query.q) {
      where.name = { [Op.like]: req.query.q + "%" };
    }

    console.log(where);
    console.log(req.user);

    const users = await User.findAll({
      where: { ...where, id: { [Op.ne]: req.userId } },
      include: [{ model: Avatar, as: "avatar", attributes: ["id", "url"] }],
      attributes: ["id", "name", "email"],
      limit: 10,
    });
    // res.json(users);
    return successResponse(res, users);
  },
  getUsersNotMemberOfChat: asyncHandler(
    async (
      req: Request<{ chatId: string }, {}, {}, { q: string; page: string }>,
      res
    ) => {
      const { chatId } = req.params;
      const page = Number(req.query.page);
      const limit = 10;
      const offset = (page - 1) * limit;
      let where: any = {};
      if (req.query.q) {
        where.name = { [Op.like]: req.query.q + "%" };
      }
      const participants = await Participant.findAll({
        where: { chat_id: chatId },
      });
      const userIds = participants.map(
        (participant) => participant.dataValues.user_id
      );
      console.log(userIds);

      const { rows: users, count } = await User.findAndCountAll({
        where: { ...where, id: { [Op.notIn]: userIds } },
        include: [{ model: Avatar, as: "avatar", attributes: ["id", "url"] }],
        attributes: ["id", "name", "email"],
        order: [["name", "ASC"]],
        offset: offset,
        limit: limit,
      });
      const nextPage = page * limit < count ? page + 1 : null;
      res.json({ data: users, nextPage });
    }
  ),
  searchUserByNameOrUsername: asyncHandler(
    async (req: Request, res: Response) => {}
  ),
  getUserById: async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params as { id: string };
    const user = await User.findByPk(id);
    if (!user) {
      return errorResponse(res, 400, "User not found");
    }
    return successResponse(res, user, "success");
  },
  login: asyncHandler(
    async (
      req: Request<{}, {}, { email: string; password: string }>,
      res: Response
    ) => {
      const { email, password } = req.body;
      // const user = await User.findOne({ where: { email: email } });
      const user = await getUserByEmail(email);

      if (!user) {
        throw new ApiError(400, "User not found", [
          {
            path: ["email"],
            message: "User not found ",
          },
        ]);
      }
      const isPasswordMatch = bcrypt.compareSync(
        password,
        user.dataValues.password
      );
      if (!isPasswordMatch) {
        throw new ApiError(400, "Invalid credentials", [
          {
            path: ["password"],
            message: "Invalid credentials",
          },
        ]);
      }
      const token = generateToken(user.dataValues.id);
      const userAvatar = user?.dataValues?.avatar
        ? { id: user?.dataValues?.avatar.id, url: user?.dataValues?.avatar.url }
        : null;

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      successResponse(
        res,
        {
          user: {
            id: user.dataValues.id,
            name: user.dataValues.name,
            email: user.dataValues.email,
            avatar: userAvatar,
          },
          token,
        },
        "login success"
      );
    }
  ),
  register: asyncHandler(
    async (
      req: Request<{}, {}, { name: string; password: string; email: string }>,
      res: Response
      // next: NextFunction
    ): Promise<any> => {
      const { email, name, password } = req.body;
      // console.log(req.body);
      // console.log(req.file);
      // throw new ApiError(400, "jhgkuyhft");

      const userExist = await User.findOne({ where: { email: email } });
      if (userExist) {
        throw new ApiError(400, "User already exists", [
          {
            path: ["email"],
            message: "User already exists",
          },
        ]);
      }

      const hashedPassword = bcrypt.hashSync(password, 10);
      console.log(hashedPassword);
      // try {

      const createdUser = await User.create({
        name,
        email,
        password: hashedPassword,
      });
      if (req.file) {
        const avatar = await Avatar.create({
          url: getStaticFilePath(req, req.file.filename),
          localPath: getLocalPath(req.file.filename),
          user_id: createdUser.dataValues.id,
          // createdAt: new Date(),
          // updatedAt: new Date(),
        });
        // createdUser.dataValues.last_avatar = avatar.dataValues.id;
        await createdUser.update({ last_avatar: avatar.dataValues.id });
        // await createdUser.save();
      }
      if (!createdUser) {
        return errorResponse(res, 500, "Unable to create user");
      }
      const user = await getUserById(createdUser.dataValues.id);
      const token = generateToken(createdUser.dataValues.id);
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      const userAvatar = user?.dataValues?.avatar
        ? { id: user?.dataValues?.avatar.id, url: user?.dataValues?.avatar.url }
        : null;
      return successResponse(
        res,
        {
          user: {
            id: createdUser.dataValues.id,
            name: createdUser.dataValues.name,
            email: createdUser.dataValues.email,
            avatar: userAvatar,
          },
          token,
        },
        "User created successfully"
      );
      // } catch (error) {
      //   console.log(error);
      //   next(error)

      // }
    }
  ),
};

export default UserController;
