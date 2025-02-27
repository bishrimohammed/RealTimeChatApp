// import * as express from "express";
import { Request } from "express-serve-static-core";

declare global {
  namespace Express {
    interface Request {
      // user?: {
      //   id: number | undefined; // Adjust the type based on your user ID type
      // };
      userId?: number | undefined;
    }
  }
}
