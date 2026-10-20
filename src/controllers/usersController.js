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
    const { name, lastName, role, password } = req.body;

    const userName = await User.generateUniqueUserName(name, lastName);

    const passwordLimpio = password?.trim() || "";
    const { salt, passwordHash } = User.generateSafePassword(passwordLimpio);

    const newUser = await User.create({
      userName,
      name,
      lastName,
      role,
      salt,
      passwordHash,
    });

    const userResponse = newUser.toObject();
    delete userResponse.passwordHash;
    delete userResponse.salt;

    return sendSuccess(res, 201, "Usuario creado con éxito", {
      user: userResponse,
    });
  } catch (error) {
    next(error);
  }
};

const editUser = async (req, res, next) => {
  try {
    const { password, name, lastName, role } = req.body;

    const user = await User.findById(req.params.id);

    if (!user || user.status === "eliminado") {
      throw new AppError(
        "Usuario no encontrado",
        404,
        null,
        ERROR_CODES.NOT_FOUND || "NOT_FOUND",
      );
    }

    const nameChanged = name !== undefined && name !== user.name;
    const lastNameChanged =
      lastName !== undefined && lastName !== user.lastName;

    if (nameChanged || lastNameChanged) {
      const newName = name || user.name;
      const newLastName = lastName || user.lastName;
      user.userName = await User.generateUniqueUserName(newName, newLastName);
    }

    if (name !== undefined) user.name = name;
    if (lastName !== undefined) user.lastName = lastName;
    if (role !== undefined) user.role = role;

    if (password && password.trim() !== "") {
      const { salt, passwordHash } = User.generateSafePassword(password.trim());
      user.salt = salt;
      user.passwordHash = passwordHash;
    }

    if (!user.isModified()) {
      return sendSuccess(res, 200, "No se detectaron cambios para actualizar", {
        user: user,
      });
    }

    await user.save();

    return sendSuccess(res, 200, "Usuario actualizado", {
      user: user,
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

    return sendSuccess(res, 200, "Usuario eliminado con éxito", {
      user: user,
    });
  } catch (error) {
    next(error);
  }
};

export { getUsers, getUserById, createUser, editUser, deleteUser };
