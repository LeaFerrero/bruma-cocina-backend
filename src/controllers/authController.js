import User from "../models/User.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const login = async (req, res, next) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({
      userName,
    });

    if (
      !user ||
      user.status == "eliminado" ||
      !user.validatePassword(password)
    ) {
      const error = new Error("Usuario y/o contraseña incorrectos");
      error.status = 401;
      throw error;
    } else {
      const token = jwt.sign(
        {
          id: user._id,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        },
      );

      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        path: "/",
        maxAge: 1000 * 60 * 60,
      });

      res.status(200).json({
        message: "Inicio de sesión exitoso",
        user: {
          id: user._id,
          rol: user.role,
          userName: user.userName,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Sesión cerrada correctamente" });
};

const verifySession = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      const error = new Error("No autorizado. Token no proporcionado.");
      error.status = 401;
      throw error;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    res.status(200).json({ isLogged: true, user });
  } catch (error) {
    console.log("Motivo del rechazo de JWT:", error.message);
    next(error);
  }
};

export { login, logout, verifySession };
