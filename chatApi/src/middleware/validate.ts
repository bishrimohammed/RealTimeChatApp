import type { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { errorResponse } from "../utils/responses";
import { ApiError } from "../utils/ApiError";
export const validate =
  <T>(schema: ZodSchema<T>) =>
  (req: Request, res: Response, next: NextFunction): any => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      throw new ApiError(400, "Required field", result.error.errors);
    }
    next();
  };
