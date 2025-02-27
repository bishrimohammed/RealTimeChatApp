import { NextFunction, Request, Response } from "express";
import { ValidationError } from "sequelize";
import { ApiError } from "../utils/ApiError";
import { removeUnusedMulterImageFilesOnError } from "../utils/helpers";
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err;
  if (err instanceof ValidationError) {
    // error.statusCode || error instanceof mongoose.Error ? 400 : 500;

    const errors = err.errors.map((error) => ({
      message: error.message,
      path: error.path,
    }));

    const message = error.message || "Something went wrong";
    error = new ApiError(400, message, errors, err.stack);
  }

  const response = {
    ...error,
    error: error.message,
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}), // Error stack traces should be visible in development for debugging
  };

  removeUnusedMulterImageFilesOnError(req);
  res.status(error.statusCode || 500).json(response);
};
