import {
  LawyerUser,
  encryptPassword,
  comparePassword,
} from "../models/LawyerUser.js";
import config from "../config.js";
import jwt from "jsonwebtoken";

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const create_lawyer_user = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(403).json({
        msj: "Completa todos los campos para continuar",
        status: false,
      });

    let userX = await LawyerUser.findOne({ email: email.toLowerCase() });
    if (userX)
      return res.status(203).json({
        msj: "Este correo ya se encuentra registrado. Por favor intenta con uno diferente",
        status: false,
      });

    const pass = await encryptPassword(password);
    const data_lawyer_user = new LawyerUser({
      email,
      password: pass,
      role: [{ name: "Admin", value: "1" }],
    });

    const new_user = await data_lawyer_user.save();
    res
      .status(200)
      .json({ msj: "Cuenta creada correctamente", status: true, new_user });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const login_lawyer = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(203)
        .json({
          msj: "Completa todos los campos para iniciar sesion",
          status: false,
        });

    let userX = await LawyerUser.findOne({ email: email.toLowerCase() });
    if (!userX)
      return res.status(403).json({ msj: "Email no valido", statis: false });

    const validate_pass = await comparePassword(password, userX.password);
    if (!validate_pass)
      return res
        .status(203)
        .json({ msj: "Contraseña invalida", status: false });

    const token = jwt.sign(
      {
        _id: userX._id,
        email: userX.email,
        role: userX.role,
      },
      config.SECRET,
      {
        expiresIn: "365d",
      }
    );

    const new_user = {
      _id: userX._id,
      token,
    };

    await LawyerUser.updateOne({ _id: userX._id }, new_user);
    res.status(200).json({
      msj: "Bienvenido!",
      status: true,
      token,
      user: {
        _id: userX._id,
        email: userX.email,
        role: userX.role,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
