import { config } from "dotenv";
config();
export default {
  PORT: process.env.PORT || "",
  SECRET: process.env.SECRET || "",
  MONGODB_URL: process.env.MONGODB_URL || "",
  DB_HOST: process.env.DB_HOST || "",
  DB_USER: process.env.DB_USER || "",
  DB_NAME: process.env.DB_NAME || "",
  DB_PASSWORD: process.env.DB_PASSWORD || "",
};
