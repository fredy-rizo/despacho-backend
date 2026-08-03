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

    const lawyer_userX = await LawyerUser.find_by_id(user.id);
    if (!lawyer_userX)
      return res
        .status(404)
        .json({ msj: "Usuario no encontrado", status: false });

    req.user = {
      id: lawyer_userX.id,
      email: lawyer_userX.email,
      role: lawyer_userX.role,
    };
    next();
    return;
  });
};
