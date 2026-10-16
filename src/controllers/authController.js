import User from "../models/User.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";
import { sendSuccess } from "../utils/responses.js";
import ERROR_CODES from "../constants/errorCodes.js";

const login = async (req, res, next) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName });

    if (
      !user ||
      user.status === "eliminado" ||
      !user.validatePassword(password)
    ) {
      throw new AppError(
        "Usuario y/o contraseña incorrectos",
        401,
        null,
        ERROR_CODES.UNAUTHORIZED || "UNAUTHORIZED",
      );
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/",
      maxAge: 1000 * 60 * 60,
    });

    return sendSuccess(res, 200, "Inicio de sesión exitoso", {
      user: {
        id: user._id,
        rol: user.role,
        userName: user.userName,
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res) => {
  res.clearCookie("token");

  return sendSuccess(res, 200, "Sesión cerrada correctamente");
};

const verifySession = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new AppError(
        "No autorizado. Token no proporcionado.",
        401,
        null,
        ERROR_CODES.UNAUTHORIZED || "UNAUTHORIZED",
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    return sendSuccess(res, 200, "Sesión validada", { isLogged: true, user });
  } catch (error) {
    if (process.env.NODE_ENV !== "test") {
      console.log("Motivo del rechazo de JWT:", error.message);
    }
    next(error);
  }
};

export { login, logout, verifySession };
