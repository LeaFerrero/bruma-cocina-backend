import User from "../models/User.js";
import AppError from "../utils/AppError.js";
import { sendSuccess } from "../utils/responses.js";
import ERROR_CODES from "../constants/errorCodes.js";

const getUsers = async (req, res, next) => {
  try {
    const activeUsers = await User.find({
      status: "activo",
    }).select("-passwordHash -salt");

    return sendSuccess(res, 200, "Usuarios listados con éxito", activeUsers);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-passwordHash -salt",
    );

    if (!user || user.status === "eliminado") {
      throw new AppError(
        "Usuario no encontrado",
        404,
        null,
        ERROR_CODES.NOT_FOUND || "NOT_FOUND",
      );
    }

    return sendSuccess(res, 200, "Usuario encontrado", user);
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { password, name, lastName, ...userData } = req.body;

    const userName = await User.generateUniqueUserName(name, lastName);

    const passwordLimpio = password?.trim() || "";
    const { salt, passwordHash } = User.generateSafePassword(passwordLimpio);

    const newUser = new User({
      userName,
      name,
      lastName,
      ...userData,
      salt,
      passwordHash,
    });

    await newUser.save();

    return sendSuccess(res, 201, "Usuario creado con éxito", { userName });
  } catch (error) {
    next(error);
  }
};

const editUser = async (req, res, next) => {
  try {
    const { password, ...userData } = req.body;

    const user = await User.findById(req.params.id);

    if (!user || user.status === "eliminado") {
      throw new AppError(
        "Usuario no encontrado",
        404,
        null,
        ERROR_CODES.NOT_FOUND || "NOT_FOUND",
      );
    }

    const nameChanged =
      userData.name !== undefined && userData.name !== user.name;
    const lastNameChanged =
      userData.lastName !== undefined && userData.lastName !== user.lastName;

    if (nameChanged || lastNameChanged) {
      const newName = userData.name || user.name;
      const newLastName = userData.lastName || user.lastName;
      userData.userName = await User.generateUniqueUserName(
        newName,
        newLastName,
      );
    }

    if (password && password.trim() !== "") {
      const { salt, passwordHash } = User.generateSafePassword(password.trim());
      userData.salt = salt;
      userData.passwordHash = passwordHash;
    }

    user.set(userData);

    if (!user.isModified()) {
      return sendSuccess(res, 200, "No se detectaron cambios para actualizar", {
        userName: user.userName,
      });
    }

    await user.save();

    return sendSuccess(res, 200, "Usuario actualizado", {
      userName: user.userName,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || user.status === "eliminado") {
      throw new AppError(
        "Usuario no encontrado",
        404,
        null,
        ERROR_CODES.NOT_FOUND || "NOT_FOUND",
      );
    }

    user.status = "eliminado";
    await user.save();

    return sendSuccess(res, 200, "Usuario eliminado con éxito");
  } catch (error) {
    next(error);
  }
};

export { getUsers, getUserById, createUser, editUser, deleteUser };
