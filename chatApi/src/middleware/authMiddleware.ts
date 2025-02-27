import { Response, Request, NextFunction } from "express-serve-static-core";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { errorResponse } from "../utils/responses";
import config from "../configs/config";

// Middleware to protect routes
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];
    // console.log(token);

    // Check if token is provided
    if (!token) {
      // return res.status(401).json({ message: "Unauthorized: no token provided" });
      return errorResponse(res, 401, "Unauthorized: no token provided");
    }

    // Verify the token
    const decoded = jwt.verify(
      token,
      config.JWT.ACCESS_TOKEN_SECRET as string
    ) as {
      id: string;
    };
    // console.log(decoded);

    if (decoded instanceof jwt.JsonWebTokenError) {
      console.log(decoded);
      return errorResponse(res, 401, "Unauthorized: token is expired");
    }
    // Fetch the user from the database
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return errorResponse(res, 401, "User not found");
    }

    // Attach user to the request object
    req.userId = user.dataValues.id;

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    // Handle different types of errors for better debugging

    if (error instanceof jwt.JsonWebTokenError) {
      // console.log(error);
      return errorResponse(res, 401, error.message);
    }

    // return res.status(500).json({ message: "Internal server error" });
  }
};
// user?: {
//   id: number | undefined; // Adjust the type based on your user ID type
// };
// userId?: number | undefined;
