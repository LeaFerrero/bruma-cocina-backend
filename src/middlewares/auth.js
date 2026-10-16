import User from "../models/User.js";
import "dotenv/config";
import jwt from "jsonwebtoken";

const protectRoute = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    const error = new Error("No está autenticado.");
    error.status = 401;
    return next(error);
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id);

    if (!user || user.status === "eliminado") {
      res.clearCookie("token");
      const error = new Error("Usuario no válido o eliminado.");
      error.status = 401;
      return next(error);
    }

    req.user = user;
    next();
  } catch (error) {
    res.clearCookie("token");
    const authError = new Error("Sesión inválida o expirada.");
    authError.status = 401;
    next(authError);
  }
};

const verifyRole = (...alowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      const error = new Error("No está autenticado.");
      error.status = 401;
      return next(error);
    }

    if (!alowedRoles.includes(req.user.role)) {
      const error = new Error("No tiene permisos para realizar esta acción.");
      error.status = 403;
      return next(error);
    }

    next();
  };
};

export { protectRoute, verifyRole };
