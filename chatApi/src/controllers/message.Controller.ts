import { Request, Response } from "express";
import Message, { getMessageWithDetailsById } from "../models/Message";
import { Conversation, getChatDetails } from "../models/Conversation";
import { errorResponse, successResponse } from "../utils/responses";
import { User } from "../models/User";
// import { asyncHandler } from "../middleware/asyncHandler";
import asyncHandler from "express-async-handler";
import { ApiError } from "../utils/ApiError";
import { emitSocketEvent } from "../socket";
import { AvailableChatEvents, ChatEventEnum } from "../contants";
import Avatar from "../models/Avatar";
import Attachment from "../models/Attachment";
import {
  getLocalPath,
  getStaticFilePath,
  removeLocalFile,
} from "../utils/helpers";
import Participant, { getChatParticipants } from "../models/participant";
type ConversationRequestParams = {
  conversationId: string;
};
// const MessageController = {
export const getMessageByConversationId = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { chatId } = req.params as { chatId: string };
    const chatExist = await Conversation.findByPk(chatId);
    if (!chatExist) {
      throw new ApiError(400, "Chat not found");
    }
    const messages = await Message.findAll({
      where: {
        conversation_id: chatId,
      },
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
      order: [["createdAt", "DESC"]],
    });

    successResponse(res, messages);
  }
);
export const sendMessage = asyncHandler(
  async (
    req: Request<{}, {}, { content: string }>,
    res: Response
  ): Promise<any> => {
    const { content } = req.body;
    const { chatId } = req.params as { chatId: string };
    // console.log(chatId);
    // console.log(req.body);
    // console.log(req.files);
    // throw new ApiError(400, "attachment");
    if (!content && req.files?.length === 0) {
      throw new ApiError(
        400,
        "Message must have either attachments or message text"
      );
    }
    const chat = await Conversation.findByPk(chatId, {
      // include: [
      //   {
      //     model: User,
      //     as: "userOne",
      //     attributes: ["id", "name", "email"],
      //   },
      //   {
      //     model: User,
      //     as: "userTwo",
      //     attributes: ["id", "name", "email"],
      //   },
      // ],
    });

    if (!chat) {
      throw new ApiError(400, "Chat not found");
    }
    const createdMessage = await Message.create({
      content,
      sender_id: req.userId!,
      conversation_id: chat!.dataValues.id,
    });
    if (req.files?.length) {
      const files = req.files as Express.Multer.File[];
      await Promise.all(
        files.map((file) => {
          return Attachment.create({
            url: getStaticFilePath(req, file.filename),
            localPath: getLocalPath(file.filename),
            message_id: createdMessage.dataValues.id,
          });
        })
      );
      await createdMessage.update({ hasAttachments: true });
    }
    const message = await Message.findOne({
      where: { id: createdMessage.dataValues.id },
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
    const participants = await Participant.findAll({
      where: { chat_id: chat?.dataValues.id },
    });
    // const friendId =
    //   chat?.dataValues.user1 === req.userId!
    //     ? chat?.dataValues.user2
    //     : chat?.dataValues.user1;
    await chat?.update({
      lastMessage_id: createdMessage.dataValues.id,
    });
    participants.map((participant) => {
      if (participant.dataValues.user_id === req.userId) return;
      emitSocketEvent(
        req,
        String(participant.dataValues.user_id),
        ChatEventEnum.MESSAGE_RECEIVED_EVENT,
        message
      );
    });
    // emitSocketEvent(
    //   req,
    //   String(friendId),
    //   ChatEventEnum.MESSAGE_RECEIVED_EVENT,
    //   message
    // );
    return successResponse(res, message);
  }
);
export const deleteMessage = asyncHandler(
  async (req: Request<{}, {}, {}>, res: Response): Promise<any> => {
    // const { content } = req.body;
    const { chatId, messageId } = req.params as {
      chatId: string;
      messageId: string;
    };

    const [message, chat] = await Promise.all([
      Message.findByPk(messageId),
      Conversation.findByPk(chatId),
    ]);
    if (!chat) {
      throw new ApiError(400, "Chat not found");
    }
    if (!message) {
      throw new ApiError(400, "Message not found");
    }
    // const eParticipant = await Participant.findOne({
    //   where: { chat_id: chatId, user_id: req.userId },
    // });
    const participants = await getChatParticipants(chat.dataValues.id);
    // console.log(participants);
    // console.log(
    //   participants.some((participant) => participant.user_id === req.userId)
    // );

    if (
      !participants.some((participant) => participant.user_id === req.userId)
    ) {
      // console.log("you are not participant");

      throw new ApiError(
        403,
        "You are not authorized to delete this message, you are not a member of chat"
      );
    }
    if (message.dataValues.sender_id !== req.userId) {
      // console.log("you are not sender");

      throw new ApiError(
        403,
        "You are not authorized to delete this message, you are not the sender"
      );
    }
    if (message.dataValues.hasAttachments) {
      // console.log("has attachments");

      const attachments = await Attachment.findAll({
        where: { message_id: message.dataValues.id },
      });
      attachments?.map((attachment) =>
        removeLocalFile(attachment.dataValues.localPath)
      );
      await Promise.all(
        attachments.map(async (attachment) => await attachment.destroy())
      );
    }
    await Message.destroy({ where: { id: message.dataValues.id } });
    if (chat.dataValues.lastMessage_id === message.dataValues.id) {
      // console.log("last message deleted");
      const lastMessage = await Message.findOne({
        where: { conversation_id: chat.dataValues.id },
        order: [["createdAt", "DESC"]],
      });
      await chat.update({
        lastMessage_id: lastMessage?.dataValues.id,
      });
    }
    // console.log("\n\n bottom \n\n");
    // const messageDetail = await getMessageWithDetailsById(message.dataValues.id)
    participants.map((participant) => {
      // console.log(participant.user_id);
      if (participant.user_id === req.userId) return;
      emitSocketEvent(
        req,
        String(participant.user_id),
        ChatEventEnum.MESSAGE_DELETE_EVENT,
        message
      );
    });
    // emitSocketEvent(
    //   req,
    //   String(friendId),
    //   ChatEventEnum.MESSAGE_RECEIVED_EVENT,
    //   message
    // );
    return successResponse(res, message, "message deleted successfully");
  }
);
// };
// export default MessageController;
