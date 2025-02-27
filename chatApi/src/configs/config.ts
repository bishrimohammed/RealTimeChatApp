import dotenv from "dotenv";

dotenv.config();

const config = {
  DB: {
    HOST: process.env.DB_HOST!,
    USER: process.env.DB_USER!,
    PASSWORD: process.env.DB_PASSWORD,
    NAME: process.env.DB_NAME!,
  },
  JWT: {
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET!,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET!,
  },
  OAUTH: {
    GOOGLE: {
      CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
      CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
      CALLBACK: process.env.GOOGLE_CALLBACK!,
    },
    //  FACEBOOK: {
    //   CLIENT_ID: process.env.
    // },
  },
};

export default config;
