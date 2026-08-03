import { FormReserve } from "../models/FormReserve.js";

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const create_form_reserve = async (req, res) => {
  try {
    const {
      full_name,
      email,
      phone,
      required_service,
      preferred_date,
      preferred_hour,
      additional_message,
    } = req.body;

    if (
      !full_name ||
      !email ||
      !phone ||
      !required_service ||
      !preferred_date ||
      !preferred_hour
    )
      return res
        .status(403)
        .json({ msj: "Completa todos los campos", status: false });

    const id = await FormReserve.create({
      full_name,
      email,
      phone,
      required_service,
      preferred_date,
      preferred_hour,
      additional_message,
      reservation_accepted: false,
    });

    const data_response = await FormReserve.find_by_id(id);
    res.status(200).json({
      msj: "Reserva creada correctamente. Cuando tu reserva sea confirmada te notificaremos",
      status: true,
      data_response,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const accepted_reservation = async (req, res) => {
  try {
    const { reserveId } = req.params;
    const { preferred_date, preferred_hour, additional_message_response } =
      req.body;

    let form_reserveX = await FormReserve.find_by_id(reserveId);
    if (!form_reserveX)
      return res
        .status(404)
        .json({ msj: "Reserva no encontrada", status: false });

    await FormReserve.update(reserveId, {
      ...form_reserveX,
      preferred_date,
      preferred_hour,
      additional_message_response,
      reservation_accepted: true,
    });

    const update_reserve = await FormReserve.find_by_id(reserveId);
    res.status(200).json({
      msj: "Reserva aceptada/modificada exitosamente",
      status: true,
      update_reserve,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const list_reservation_true = async (req, res) => {
  try {
    const cant = await FormReserve.count(true);
    const data = await FormReserve.find(true, req.body.skippag, req.body.limit);
    res.status(200).json({
      msj: "Cargando reservas aceptadas",
      status: true,
      data,
      pagination: {
        pag: req.params.pag,
        perpage: req.body.limit,
        pags: Math.ceil(cant / req.body.limit),
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const list_reservation_false = async (req, res) => {
  try {
    const cant = await FormReserve.count(false);
    const data = await FormReserve.find(
      false,
      req.body.skippag,
      req.body.limit,
    );
    res.status(200).json({
      msj: "Cargando reservas no aceptadas",
      status: true,
      data,
      pagination: {
        pag: req.params.pag,
        perpage: req.body.limit,
        pags: Math.ceil(cant / req.body.limit),
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const list_reservation_alls = async (req, res) => {
  try {
    const cant = await FormReserve.count();
    const data = await FormReserve.find(null, req.body.skippag, req.body.limit);

    res.status(200).json({
      msj: "Cargando todas las reservas",
      status: true,
      data,
      pagination: {
        pag: req.params.pag,
        perpage: req.body.limit,
        pags: Math.ceil(cant / req.body.limit),
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const remove_reservation = async (req, res) => {
  try {
    const { reservationId } = req.params;

    const reservationX = await FormReserve.find_by_id(reservationId);
    if (!reservationX)
      return res
        .status(404)
        .json({ msj: "Reserva no encontrada.", status: false });

    await FormReserve.delete(reservationId);

    res.status(200).json({
      msj: "Reserva eliminada exitosamente.",
      status: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
