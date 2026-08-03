import { db } from "../database/MySQL/MySQL.js";

export class FormReserve {
  static async create(data) {
    const [result] = await db.execute(
      `INSERT INTO form_reserves
      (
        full_name,
        email,
        phone,
        required_service,
        preferred_date,
        preferred_hour,
        additional_message,
        additional_message_response,
        reservation_accepted
      )
      VALUEs (?,?,?,?,?,?,?,?)`,
      [
        data.full_name,
        data.email,
        data.phone,
        data.required_service,
        data.preferred_date,
        data.preferred_hour,
        data.additional_message,
        data.additional_message_response,
        data.reservation_accepted ?? false,
      ],
    );
    return result.insertId;
  }

  static async find_all() {
    const [rows] = await db.execute(
      `SELECT *
      FROM form_reserves
      ORDER BY created_at DESC`,
    );
    return rows;
  }

  static async find_by_id(id) {
    const [rows] = await db.execute(
      `SELECT *
      FROM form_reserves
      WHERE id=?`,
      [id],
    );
    return rows[0] || null;
  }

  static async update(id, data) {
    await db.execute(
      `UPDATE form_reserves
      SET
        full_name=?,
        email=?,
        phone=?,
        required_service=?,
        preferred_date=?,
        preferred_hour=?,
        additional_message=?,
        additional_message_response=?,
        reservation_accepted=?
      WHERE id=?`,
      [
        data.full_name,
        data.email,
        data.phone,
        data.required_service,
        data.preferred_date,
        data.preferred_hour,
        data.additional_message,
        data.additional_message_response,
        data.reservation_accepted,
        id,
      ],
    );
  }

  static async update_reservation_status(id, reservation_accepted) {
    await db.execute(
      `UPDATE form_reserves
      SET reservation_accepted=?
      WHERE id=?`,
      [reservation_accepted, id],
    );
  }

  static async delete(id) {
    await db.execute("DELETE FROM form_reserves WHERE id=?", [id]);
  }

  static async count(reservation_accepted = null) {
    let sql = "SELECT COUNT(*) AS total FROM form_reserves";
    const params = [];

    if (reservation_accepted !== null) {
      sql += " WHERE reservation_accepted = ?";
      params.push(reservation_accepted);
    }

    const [rows] = await db.execute(sql, params);
    return rows[0].total;
  }

  static async find(reservation_accepted = null, offset = 0, limit = 10) {
    let sql = "SELECT * FROM form_reserves";
    const params = [];

    if (reservation_accepted !== null) {
      sql += " WHERE reservation_accepted = ?";
      params.push(reservation_accepted);
    }

    sql += " ORDER BY id ASC LIMIT ? OFFSET ?";

    params.push(Number(limit));
    params.push(Number(offset));

    const [rows] = await db.execute(sql, params);
    return rows;
  }
}
