import type { Request, Response } from "express";
import { Conversation, getChatDetails } from "../models/Conversation";
import { Op } from "sequelize";
import Message from "../models/Message";
import { User } from "../models/User";
import { errorResponse, successResponse } from "../utils/responses";
// import { asyncHandler } from "../middleware/asyncHandler";
import asyncHandler from "express-async-handler";
import { emitSocketEvent } from "../socket";
import { ChatEventEnum } from "../contants";
import Avatar from "../models/Avatar";
import { createGroupType } from "../schemas/user";
import { ApiError } from "../utils/ApiError";
import Participant, {
  createParticipant,
  getChatParticipants,
  getUserParticipants,
} from "../models/participant";
// const ConservationController = {

export const createOrGetOneToOneChat = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { receiverId } = req.params as { receiverId: string };
  console.log("\n\n one to one\n\n");
  const receiverUser = await User.findByPk(receiverId);
  if (!receiverUser) {
    return errorResponse(res, 400, "Receiver user not found");
  }
  const chat = await Conversation.findOne({
    where: {
      [Op.or]: [
        {
          user1: req.userId!,
          user2: receiverId,
        },
        {
          user1: receiverId,
          user2: req.userId!,
        },
      ],
    },
    include: [
      {
        model: User,
        as: "userOne",
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
        model: User,
        as: "userTwo",
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
        model: Message,
        as: "lastMessage",
      },
    ],
  });
  if (chat) {
    return successResponse(res, chat, "Chat retrived success");
  }

  const newConversation = await Conversation.create({
    user1: req.userId!,
    user2: receiverUser.dataValues.id,
  });
  if (!newConversation) {
    return errorResponse(res, 500, "Failed to create new conversation");
  }
  await createParticipant(
    [req.userId!, receiverUser.dataValues.id],
    newConversation.dataValues.id
  );
  const conversationWithDetails = await getChatDetails(
    newConversation.dataValues.id
  );
  // await Conversation.findOne({
  //   where: { id: newConversation.dataValues.id },
  //   include: [
  //     {
  //       model: Message,
  //       as: "lastMessage",
  //     },
  //     // {
  //     //   model: User,
  //     //   as: "userOne",
  //     //   include: [
  //     //     {
  //     //       model: Avatar,
  //     //       as: "avatar",
  //     //       attributes: ["id", "url"],
  //     //     },
  //     //   ],
  //     //   attributes: ["id", "name", "email", "avatar"],
  //     // },
  //     // {
  //     //   model: User,
  //     //   as: "userTwo",
  //     //   include: [
  //     //     {
  //     //       model: Avatar,
  //     //       as: "avatar",
  //     //       attributes: ["id", "url"],
  //     //     },
  //     //   ],
  //     //   attributes: ["id", "name", "email", "avatar"],
  //     // },
  //   ],
  // });
  emitSocketEvent(
    req,
    receiverId,
    ChatEventEnum.NEW_CHAT_EVENT,
    conversationWithDetails
  );
  return successResponse(
    res,
    conversationWithDetails,
    "New conversation created successfully"
  );
};
export const createGroupChat = async (
  req: Request<{}, {}, {}, {}>,
  res: Response
): Promise<any> => {
  const { members, name } = req.body as createGroupType;
  console.log("\n\n mefbehjgfbr\n\n");

  const userID = req.userId!;
  if (members.includes(userID)) {
    throw new ApiError(
      400,
      "Chat members array should not contain the group creator"
    );
  }
  const nonDublicateMembers = [...new Set([...members, userID])];
  if (nonDublicateMembers.length < 3) {
    throw new ApiError(
      400,
      "Seems like you have passed duplicate group chat members."
    );
  }

  const newConversation = await Conversation.create({
    name: name,
    isGroup: true,
    admin: userID,
  });
  await Promise.all(
    nonDublicateMembers.map(async (memberId) => {
      return await Participant.create({
        chat_id: newConversation.dataValues.id,
        user_id: memberId,
      });
    })
  );
  if (!newConversation) {
    return errorResponse(res, 500, "Failed to create new conversation");
  }
  const [conversationWithDetails, participants] = await Promise.all([
    getChatDetails(newConversation.dataValues.id),
    getChatParticipants(newConversation.dataValues.id),
  ]);
  // const conversationWithDetails = await Conversation.findOne({
  //   where: { id: newConversation.dataValues.id },
  //   include: [
  //     {
  //       model: Message,
  //       as: "lastMessage",
  //     },
  //     {
  //       model: Participant,
  //       as: "participants",
  //       include: [
  //         {
  //           model: User,
  //           as: "user",
  //           include: [
  //             {
  //               model: Avatar,
  //               as: "avatar",
  //               attributes: ["id", "url"],
  //             },
  //           ],
  //           attributes: ["id", "name", "email", "avatar"],
  //         },
  //       ],
  //       limit: 3,
  //     },
  //   ],
  // });
  // const participants = await getChatParticipants(newConversation.dataValues.id);

  participants.map((participant) => {
    if (participant.id === userID) return;
    emitSocketEvent(
      req,
      String(participant.id),
      ChatEventEnum.NEW_CHAT_EVENT,
      conversationWithDetails
    );
  });
  return successResponse(
    res,
    conversationWithDetails,
    "New conversation created successfully"
  );
};
export const addGroupChatParticipants = asyncHandler(
  async (
    req: Request<
      { chatId: string },
      {},
      { members: number[] },
      { page: string }
    >,
    res: Response
  ) => {
    const { chatId } = req.params;
    const { members } = req.body;
    console.log(members);
    const chat = await Conversation.findByPk(chatId);
    if (!chat) {
      return errorResponse(res, 404, "Chat not found");
    }
    const existingParticipants = await Participant.findAll({
      where: { chat_id: chatId, user_id: members },
    });
    if (existingParticipants.length) {
      return errorResponse(res, 400, "User(s) already exist in the group");
    }

    if (!chat.dataValues.isGroup) {
      return errorResponse(
        res,
        400,
        "Cannot add participants to a one-on-one chat"
      );
    }
    if (chat.dataValues.admin !== req.userId) {
      return errorResponse(
        res,
        403,
        "You don't have permission to add participants the chat"
      );
    }
    const nonDublicateMembers = [...new Set([...members])];
    if (nonDublicateMembers.length < 1) {
      throw new ApiError(
        400,
        "Seems like you have passed duplicate group chat members."
      );
    }
    const participants = await createParticipant(
      nonDublicateMembers,
      chat.dataValues.id
    );
    const chatDetails = await getChatDetails(chat.dataValues.id);
    nonDublicateMembers.map((userId) => {
      emitSocketEvent(
        req,
        String(userId),
        ChatEventEnum.NEW_CHAT_EVENT,
        chatDetails
      );
    });
    return successResponse(res, participants, "success");
    // return successResponse(res, participants);
  }
);
export const getGroupChatParticipants = asyncHandler(
  async (
    req: Request<{ chatId: string }, {}, {}, { page: string }>,
    res: Response
  ) => {
    const { chatId } = req.params;
    // const {page} = req.query. as {page: string}
    const page = Number(req.query.page);
    const limit = 10;
    const offset = (page - 1) * limit;
    const { rows, count } = await Participant.findAndCountAll({
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
          // order: [["name", "ASC"]],
          attributes: ["id", "name", "email"],
        },
      ],
      // order: [[{ model: User, as: "user" }, "name", "ASC"]],
      offset,
      limit,
    });
    const nextPage = page * limit < count ? page + 1 : null;
    const participants = rows.map((participant) => participant.dataValues.user);
    res.json({ data: participants, nextPage });
    // return successResponse(
    //   res,
    //   participants.map((participant) => participant.dataValues.user)
    // );
  }
);
export const getUserConservations = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    // const { conservationId } = req.params;
    // const user = req.user;
    const participants = await getUserParticipants(req.userId!);
    const chatIds = participants.map((participant) => participant.chat_id);
    // const  =
    //  req.user?.id
    const conversations: unknown = await Conversation.findAll({
      // where: { [Op.or]: [{ user1: req.userId }, { user2: req.userId }] },
      where: {
        id: chatIds,
      },
      include: [
        {
          model: Participant,
          as: "participants",
          // where: { user_id: req.userId }, // Filter by the specific user ID
          // required: true,
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
          model: User,
          as: "userOne",
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
          model: User,
          as: "userTwo",
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
      order: [["updatedAt", "DESC"]],
    });

    return successResponse(res, conversations);
  }
);
// };

// export default ConservationController;
