import express, { Router } from "express";
import * as MessageController from "../controllers/message.Controller";
import { protect } from "../middleware/authMiddleware";
import { validate } from "../middleware/validate";
import { sendMessageSchema } from "../schemas/user";
import { upload } from "../middleware/multer";
const router = express.Router() as Router;

router.get("/:chatId", protect, MessageController.getMessageByConversationId);

router.post(
  "/:chatId",
  protect,
  upload.array("attachments", 5),
  validate(sendMessageSchema),
  MessageController.sendMessage
);
router.delete("/:messageId/:chatId", protect, MessageController.deleteMessage);
export default router;
