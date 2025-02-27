import { z } from "zod";
export const userSchema = z.object({
  name: z.string().min(3, "User must contain at least 6 character(s)"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must contain at least 6 character(s)"),
});
export const userLoginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email"),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must contain at least 6 character(s)"),
});
export const messageSchema = z.object({
  chatId: z.number(),
  message: z.string().min(1),
});
export const sendMessageSchema = z.object({
  content: z.string({ required_error: "Message content is Required" }).trim(),
  // .min(1, "Message content must contain at least 1 character"),
});
export const createGroupSchema = z.object({
  name: z
    .string({ required_error: "Group name is required" })
    .trim()
    .min(3, "Group name must contain at least 3 characters"),
  members: z
    .number()
    .array()
    .nonempty({
      message: "members can't be empty!",
    })
    .min(3, "Group members must contain at least 3 users"),
});
export const addParticipantsSchema = z.object({
  members: z
    .number()
    .array()
    .nonempty({
      message: "members can't be empty!",
    })
    .min(1, "Group members must contain at least 1 users"),
});
export type UserRegister = z.infer<typeof userSchema>;
export type UserLogin = z.infer<typeof userLoginSchema>;
export type message = z.infer<typeof messageSchema>;
export type createGroupType = z.infer<typeof createGroupSchema>;
