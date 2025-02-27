import express, { Router } from "express";
import * as ConservationController from "../controllers/Conservation.Controller";
import { protect } from "../middleware/authMiddleware";
import { validate } from "../middleware/validate";
import { addParticipantsSchema, createGroupSchema } from "../schemas/user";
const router = express.Router() as Router;
router.get("/", protect, ConservationController.getUserConservations);
router.get(
  "/:chatId/participants",
  ConservationController.getGroupChatParticipants
);
router.post(
  "/group",
  protect,
  validate(createGroupSchema),
  ConservationController.createGroupChat
);
router.post(
  "/:receiverId",
  protect,
  ConservationController.createOrGetOneToOneChat
);
router.post(
  "/:chatId/participants",
  protect,
  validate(addParticipantsSchema),
  ConservationController.addGroupChatParticipants
);

export default router;
