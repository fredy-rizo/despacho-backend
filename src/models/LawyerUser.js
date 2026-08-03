import bcrypt from "bcrypt";
import { db } from "../database/MySQL/MySQL.js";

export class LawyerUser {
  static async create(data) {
    const [result] = await db.execute(
      `INSERT INTO lawyer_users
        (
          token,
          email,
          password
        )
          VALUES (?,?,?)`,
      [data.token || "", data.email, data.password],
    );
    return result.insertId;
  }

  static async find_all() {
    const [rows] = await db.execute("SELECT * FROM lawyer_users");
    return rows;
  }

  static async find_by_id(id) {
    const [rows] = await db.execute("SELECT * FROM lawyer_users WHERE id=?", [
      id,
    ]);
    return rows[0] || null;
  }

  static async find_by_email(email) {
    const [rows] = await db.execute(
      "SELECT * FROM lawyer_users WHERE email=? LIMIT 1",
      [email],
    );
    return rows[0] || null;
  }

  static async update(id, data) {
    await db.execute(
      `UPDATE lawyer_users
      SET
        token=?,
        email=?,
        password=?
      WHERE id=?`,
      [data.token, data.email, data.password, id],
    );
  }

  static async update_token(id, token) {
    await db.execute("UPDATE lawyer_users SET token=? WHERE id=?", [token, id]);
  }

  static async update_password(id, password) {
    await db.execute("UPDATE lawyer_users SET password=? WHERE id=?", [
      password,
      id,
    ]);
  }

  static async delete(id) {
    await db.execute("DELETE FROM lawyer_users WHERE id=?", [id]);
  }

  static async count() {
    const [rows] = await db.execute(
      "SELECT COUNT(*) AS total FROM lawyer_users",
    );
    return rows[0].total;
  }
}

export const encryptPassword = async (password) => {
  return await bcrypt.hash(password.toString(), 10);
};

export const comparePassword = async (password, receive_password) => {
  return await bcrypt.compare(password, receive_password);
};
