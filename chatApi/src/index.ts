import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import session from "express-session";
import {
  authRoute,
  conservationRoute,
  messageRoute,
  userRoute,
} from "./routes";

import { errorHandler } from "./middleware/errorMiddleWare";
import { initializeSocketIO } from "./socket";
import passport from "passport";
import("./passport/index");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3005;

// Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  express.static("public")
  // "/uploads",
  // express.static(path.join(currentDirname, "../public/uploads"))
);
// Create an HTTP server and pass the app to it

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
const server = http.createServer(app);

// Create a Socket.IO server
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", credentials: true },
});
app.set("io", io);
app.use(session({ secret: "secret" }));
app.use(passport.initialize());
app.use(passport.session());
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/chats", conservationRoute);
app.use("/api/v1/messages", messageRoute);

app.use(errorHandler);

initializeSocketIO(io);
// Start the server
server.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// yarn add express passport passport-google-oauth20 sequelize zod mysql2 multer

// yarn add  cors jsonwebtoken dotenv express-session cookie-parser socket.io bcryptjs express-async-handler

// yarn add --dev ts-node typescript @types/node @types/sequelize @types/bcryptjs

// yarn add --dev @types/cookie-parser @types/cors @types/express @types/jsonwebtoken @types/multer
