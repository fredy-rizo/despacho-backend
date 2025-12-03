import mongoose from "mongoose";
import bcrypt from "bcrypt";
const { Schema } = mongoose;

const LawyerUserSchema = new Schema(
  {
    token: { type: String, default: "" },
    email: String,
    password: String,
    role: [{ name: String, value: String }],
  },
  { timestamps: true }
);

export const encryptPassword = async (password) => {
  const pass = password.toString();
  return await bcrypt.hash(pass, parseInt(10));
};

export const comparePassword = async (password, receivePassword) => {
  return await bcrypt.compare(password, receivePassword);
};

/*
  role
  1 → Admin
  2 → SuperAdmin
*/

export const LawyerUser = mongoose.model("LawyerUser", LawyerUserSchema);
