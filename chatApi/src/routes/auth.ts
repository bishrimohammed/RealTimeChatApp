import express from "express";
import passport from "passport";
import { generateToken } from "../utils/generateToken";

const router = express.Router();

router.get("/google", passport.authenticate("google"));
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  function (req, res) {
    // Successful authentication, redirect home.
    const userInfo = req.user!;
    // console.log(req.user);
    const token = generateToken(userInfo.id);
    // res.status(200).json({ success: true, msg: "lkjfgdfffhj" });
    const user = encodeURIComponent(
      JSON.stringify({
        id: userInfo.id,
        name: userInfo.name,
        email: userInfo.email,
        avatar: null,
      })
    );
    const redirect_url = process.env.CLIENT_OAUTH_REDIRECT_URL;
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.redirect(`${redirect_url}?token=${token}&user=${user}`);
  }
);
export default router;
