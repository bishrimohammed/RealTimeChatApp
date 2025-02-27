import cookie from "cookie";
import jwt from "jsonwebtoken";
import { Server, Socket } from "socket.io";
import { AvailableChatEvents, ChatEventEnum } from "../contants";
// import { User } from "../models/apps/auth/user.models.js";
import { ApiError } from "../utils/ApiError";
import { User } from "../models/User";
import { Request } from "express";

type SocketWithUser = Socket & { user?: any }; // Replace 'any' with the actual user type if available

/**
 * @description This function is responsible to allow user to join the chat represented by chatId (chatId). event happens when user switches between the chats
 * @param {SocketWithUser} socket
 */
const mountJoinChatEvent = (socket: SocketWithUser): void => {
  socket.on(ChatEventEnum.JOIN_CHAT_EVENT, (chatId: string) => {
    console.log(`User joined the chat 🤝. chatId: `, chatId);
    socket.join(chatId);
  });
};

/**
 * @description This function is responsible to emit the typing event to the other participants of the chat
 * @param {SocketWithUser} socket
 */
const mountParticipantTypingEvent = (socket: SocketWithUser): void => {
  socket.on(ChatEventEnum.TYPING_EVENT, (chatId: string) => {
    socket.in(chatId).emit(ChatEventEnum.TYPING_EVENT, chatId);
  });
};

/**
 * @description This function is responsible to emit the stopped typing event to the other participants of the chat
 * @param {SocketWithUser} socket
 */
const mountParticipantStoppedTypingEvent = (socket: SocketWithUser): void => {
  socket.on(ChatEventEnum.STOP_TYPING_EVENT, (chatId: string) => {
    socket.in(chatId).emit(ChatEventEnum.STOP_TYPING_EVENT, chatId);
  });
};

/**
 *
 * @param {Server} io
 */
const initializeSocketIO = (io: Server): void => {
  io.on("connection", async (socket: SocketWithUser) => {
    try {
      //   console.log("\n\ngfjhgfjty\\n");

      const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
      //   console.log(cookies);

      let token = cookies.token; // get the accessToken
      //   console.log(token);

      if (!token) {
        token = socket.handshake.auth?.token;
      }

      if (!token) {
        throw new ApiError(401, "Un-authorized handshake. Token is missing");
      }

      const decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as { id: string }; // decode the token

      const user = await User.findByPk(decodedToken?.id, {
        attributes: ["id", "name", "email"],
      });

      if (!user) {
        throw new ApiError(401, "Un-authorized handshake. Token is invalid");
      }
      socket.user = user.dataValues; // mount the user object to the socket
      //   console.log(socket.user);

      socket.join(user.dataValues.id.toString());
      socket.emit(ChatEventEnum.CONNECTED_EVENT);
      console.log("User connected 🗼. userId: ", user.dataValues.id.toString());

      mountJoinChatEvent(socket);
      mountParticipantTypingEvent(socket);
      mountParticipantStoppedTypingEvent(socket);

      socket.on(ChatEventEnum.DISCONNECT_EVENT, () => {
        console.log("user has disconnected 🚫. userId: " + socket.user?.id);
        if (socket.user?.id) {
          socket.leave(socket.user.id);
        }
      });
    } catch (error) {
      //   socket.emit(
      //     ChatEventEnum.SOCKET_ERROR_EVENT,
      //     error?.message || "Something went wrong while connecting to the socket."
      //   );
      const socketErrorMessage =
        error instanceof ApiError
          ? error.message
          : "Something went wrong while connecting to the socket.";

      // Emit the socket error event with a specific message
      socket.emit(ChatEventEnum.SOCKET_ERROR_EVENT, socketErrorMessage);
    }
  });
};

/**
 *
 * @param {import("express").Request} req - Request object to access the `io` instance set at the entry point
 * @param {string} roomId - Room where the event should be emitted
 * @param {AvailableChatEvents[0]} event - Event that should be emitted
 * @param {any} payload - Data that should be sent when emitting the event
 * @description Utility function responsible to abstract the logic of socket emission via the io instance
 */
const emitSocketEvent = (
  req: Request, // Replace `any` with the actual type for Express Request if available
  roomId: string,
  event: string,
  payload: any
): void => {
  req.app.get("io").in(roomId).emit(event, payload);
};

export { initializeSocketIO, emitSocketEvent };
