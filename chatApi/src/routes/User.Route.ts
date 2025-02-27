import express, { Router } from "express";
import UserController from "../controllers/User.Controller";
import { validate } from "../middleware/validate";
import {
  UserRegister,
  UserLogin,
  userSchema,
  userLoginSchema,
} from "../schemas/user";
import { protect } from "../middleware/authMiddleware";
import { upload } from "../middleware/multer";
const router = express.Router();
router.get("/", protect, UserController.getUsers);

router.get("/:id", protect, UserController.getUserById);
router.get("/chat/:chatId", protect, UserController.getUsersNotMemberOfChat);
router.post(
  "/",
  upload.single("avatar"),
  validate(userSchema),
  UserController.register
);
router.post("/login", validate(userLoginSchema), UserController.login);

export default router;
