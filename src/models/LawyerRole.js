import { db } from "../database/MySQL/MySQL.js";

export class LawyerRole {
  static async create(data) {
    const [result] = await db.execute(
      `INSERT INTO lawyer_roles
            (
                user_id,
                name,
                value
            )
            VALUES (?,?,?)`,
      [data.user_id, data.name, data.value],
    );
    return result.insertId;
  }

  static async find_by_user(user_id) {
    const [rows] = await db.execute(
      `SELECT
                id,
                name,
                value
            FROM lawyer_roles
            WHERE user_id=?`,
      [user_id],
    );
    return rows;
  }

  static async find_by_id(id) {
    const [rows] = await db.execute(
      `SELECT *
            FROM lawyer_roles
            WHERE id=?`,
      [id],
    );
    return rows[0] || null;
  }

  static async update(id, data) {
    await db.execute(
      `UPDATE lawyer_roles
            SET
                name=?,
                value=?
            WHERE id=?`,
      [data.name, data.value, id],
    );
  }

  static async delete(id) {
    await db.execute("DELETE FROM lawyer_roles WHERE id=?", [id]);
  }

  static async delete_by_user(user_id) {
    await db.execute("DELETE FROM lawyer_roles WHERE user_id=?", [user_id]);
  }
}
