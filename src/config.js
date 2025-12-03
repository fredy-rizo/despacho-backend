import { config } from "dotenv";
config();
export default {
  PORT: process.env.PORT || "",
  SECRET: process.env.SECRET || "",
  MONGODB_URL: process.env.MONGODB_URL || "",
};
