import {
  LawyerUser,
  encryptPassword,
  comparePassword,
} from "../models/LawyerUser.js";
import config from "../config.js";
import jwt from "jsonwebtoken";
import { LawyerRole } from "../models/LawyerRole.js";

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

    let userX = await LawyerUser.find_by_email(email.toLowerCase());
    if (userX)
      return res.status(203).json({
        msj: "Este correo ya se encuentra registrado. Por favor intenta con uno diferente",
        status: false,
      });

    const pass = await encryptPassword(password);
    const total_user = await LawyerUser.count();
    const id = await LawyerUser.create({
      token: "",
      email: email.toLowerCase(),
      password: pass,
    });

    // if (total_user === 0) {
    //   await LawyerRole.create({
    //     user_id: id,
    //     name: "Admin",
    //     value: "1",
    //   });
    // } else {
    //   await LawyerRole.create({
    //     user_id: id,
    //     name: "User",
    //     value: "2",
    //   });
    // }

    await LawyerRole.create({
      user_id: id,
      name: "Admin",
      value: "1",
    });

    const new_user = await LawyerUser.find_by_id(id);
    new_user.role = await LawyerRole.find_by_user(id);
    res
      .status(200)
      .json({ msj: "Cuenta creada exitosamente", status: true, new_user });
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
      return res.status(203).json({
        msj: "Completa todos los campos para iniciar sesion",
        status: false,
      });

    const userX = await LawyerUser.find_by_email(email.toLowerCase());
    if (!userX)
      return res.status(403).json({ msj: "Email no valido", statis: false });

    userX.role = await LawyerRole.find_by_user(userX.id);

    const validate_pass = await comparePassword(password, userX.password);
    if (!validate_pass)
      return res
        .status(203)
        .json({ msj: "Contraseña invalida", status: false });

    const token = jwt.sign(
      {
        id: userX.id,
        email: userX.email,
        role: userX.role,
      },
      config.SECRET,
      {
        expiresIn: "365d",
      },
    );

    await LawyerUser.update_token(userX.id, token);
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
