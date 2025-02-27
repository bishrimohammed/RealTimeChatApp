import { Response } from "express";

export const successResponse = (
  res: Response,
  data: any,
  message: string = "success"
) => {
  res.status(200).json({ success: true, data, message });
};

export const errorResponse = (
  res: Response,
  status: number,
  error: string,
  errors?: any[],
  stack?: any
): void => {
  res.status(status).json({
    success: false,
    error,
    errors,
    stack: process.env.NODE_ENV === "development" ? stack : undefined,
  });
};
