import jwt from "jsonwebtoken";
import config from "../../config.js";
import { LawyerUser } from "../../models/LawyerUser.js";

export const Token = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token)
    return res.status(401).json({ msj: "Sin autorizacion", status: false });

  jwt.verify(token, config.SECRET, async (err, user) => {
    if (err) {
      if (err.message === "jwt expired")
        return res
          .status(403)
          .json({ msj: "Sesion finalizada", status: false });
      return res
        .status(403)
        .json({ msj: `${err.message}. Rechazo en la conexion`, status: false });
    }

    let lawyer_userX = await LawyerUser.findById(user._id);
    if (!lawyer_userX)
      return res
        .status(404)
        .json({ msj: "Usuario no encontrado", status: false });

    req.user = {
      _id: lawyer_userX._id,
      email: lawyer_userX.email,
      role: lawyer_userX.role,
    };
    next();
    return;
  });
};
