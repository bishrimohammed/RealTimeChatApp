import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import { User } from "../models/User";
import { UserLoginType } from "../contants";
import { ApiError } from "../utils/ApiError";
import bcrypt from "bcryptjs";
import config from "../configs/config";
passport.serializeUser((user, done) => {
  console.log("se");

  done(null, user?.email);
});
passport.deserializeUser(async (email: string, done) => {
  console.log("de");
  // let user
  // try {

  //    user = await User.findOne({where: {email}});
  // } catch (error) {
  //   console.log(error);
  //   done(new ApiError(404,"User is not found"));
  // }
  // done(null, user?.dataValues);
  try {
    const user = await User.findOne({ where: { email } });
    if (user) done(null, user.dataValues); // return user of exist
    else done(new ApiError(404, "User does not exist"), null); // throw an error if user does not exist
  } catch (error) {
    done(
      new ApiError(
        500,
        "Something went wrong while deserializing the user. Error: " + error
      ),
      null
    );
  }
});
passport.use(
  new Strategy(
    {
      clientID: config.OAUTH.GOOGLE.CLIENT_ID,
      clientSecret: config.OAUTH.GOOGLE.CLIENT_SECRET,
      callbackURL: config.OAUTH.GOOGLE.CALLBACK,
      scope: ["email", "profile"],
    },
    async (accessToken, refreshToken, profile, done) => {
      // const user = {
      //   // googleId: profile.id,
      //   name: profile.displayName,
      //   email: profile.emails![0].value,
      // };
      const user = await User.findOne({
        where: { email: profile._json.email },
      });
      if (user) {
        // if user exists, check if user has registered with the GOOGLE SSO
        if (user.dataValues.login_type !== UserLoginType.GOOGLE) {
          // If user is registered with some other method, we will ask him/her to use the same method as registered.
          // TODO: We can redirect user to appropriate frontend urls which will show users what went wrong instead of sending response from the backend
          done(
            new ApiError(
              400,
              "You have previously registered using " +
                user.dataValues.login_type
                  ?.toLowerCase()
                  ?.split("_")
                  .join(" ") +
                ". Please use the " +
                user.dataValues.login_type
                  ?.toLowerCase()
                  ?.split("_")
                  .join(" ") +
                " login option to access your account."
            ),
            undefined
          );
        } else {
          // If user is registered with the same login method we will send the saved user
          // const {email} = user.dataValues
          done(null, user.dataValues);
        }
      } else {
        // If user with email does not exists, means the user is coming for the first time
        const hashedPassword = bcrypt.hashSync(profile._json.sub, 10);
        const createdUser = await User.create({
          email: profile._json.email!,
          name: profile.displayName!,
          password: hashedPassword,

          login_type: UserLoginType.GOOGLE,
        });
        if (createdUser) {
          done(null, createdUser.dataValues);
        } else {
          done(
            new ApiError(500, "Error while registering the user"),
            undefined
          );
        }
      }
    }
  )
);
