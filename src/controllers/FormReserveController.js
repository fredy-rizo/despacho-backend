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

    const new_form_reserve = new FormReserve({
      full_name,
      email,
      phone,
      required_service,
      preferred_date,
      preferred_hour,
      additional_message,
    });

    const data_response = await new_form_reserve.save();
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
    const { preferred_date, preferred_hour } = req.body;

    let form_reserveX = await FormReserve.findById(reserveId);
    if (!form_reserveX)
      return res
        .status(404)
        .json({ msj: "Reserva no encontrada", status: false });

    await FormReserve.updateOne(
      { _id: reserveId },
      {
        $set: {
          preferred_date,
          preferred_hour,
          reservation_accepted: true,
        },
      }
    );

    const update_reserve = await FormReserve.findById(reserveId);
    res.status(200).json({
      msj: "Reserva aceptada/modificada correctamente",
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
    const cant = await FormReserve.find({
      reservation_accepted: true,
    }).countDocuments();
    const data = await FormReserve.find({ reservation_accepted: true })
      .skip(req.body.skippag)
      .limit(req.body.limit)
      .sort({ _id: -1 });

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
    const cant = await FormReserve.find({
      reservation_accepted: false,
    }).countDocuments();
    const data = await FormReserve.find({ reservation_accepted: false })
      .skip(req.body.skippag)
      .limit(req.body.limit)
      .sort({ _id: -1 });

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
    const cant = await FormReserve.find({}).countDocuments();
    const data = await FormReserve.find({})
      .skip(req.body.skippag)
      .limit(req.body.limit)
      .sort({ _id: -1 });

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

    const reservationX = await FormReserve.findById(reservationId);
    if (!reservationX)
      return res
        .status(404)
        .json({ msj: "Reserva no encontrada.", status: false });

    await Promise.all([FormReserve.deleteOne({ _id: reservationId })]);

    res.status(200).json({
      msj: "Reserva eliminada exitosamente.",
      status: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
