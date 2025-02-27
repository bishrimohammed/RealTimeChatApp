import jwt from "jsonwebtoken";
import config from "../configs/config";
export const generateToken = (userId: number): string => {
  const token = jwt.sign({ id: userId }, config.JWT.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
  // res.cookie("token", token, {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === "production",
  //   sameSite: "strict",
  // });
  return token;
};
