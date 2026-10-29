import User from "../models/User.js";
import "dotenv/config";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";
import ERROR_CODES from "../constants/errorCodes.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      throw new AppError(
        "No está autenticado.",
        401,
        null,
        ERROR_CODES.UNAUTHORIZED,
      );
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id);

    if (!user || user.status === "eliminado") {
      res.clearCookie("token");
      throw new AppError(
        "Usuario no válido o eliminado.",
        401,
        null,
        ERROR_CODES.UNAUTHORIZED,
      );
    }

    req.user = user;
    next();
  } catch (error) {
    res.clearCookie("token");
    next(error);
  }
};

const verifyRole = (...alowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        new AppError(
          "No está autenticado.",
          401,
          null,
          ERROR_CODES.UNAUTHORIZED,
        ),
      );
    }

    if (!alowedRoles.includes(req.user.role)) {
      return next(
        new AppError(
          "No tiene permisos para realizar esta acción.",
          403,
          null,
          ERROR_CODES.FORBIDDEN,
        ),
      );
    }

    next();
  };
};

export { protectRoute, verifyRole };
