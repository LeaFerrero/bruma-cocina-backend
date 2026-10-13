import User from "../models/Usuario.js";

const getUsers = async (req, res, next) => {
  try {
    const activeUsers = await User.find({
      status: "activo",
    }).select("-passwordHash -salt");

    res.status(200).json(activeUsers);
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
      const error = new Error("Usuario no encontrado");
      error.status = 404;
      return next(error);
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { password, name, lastName, ...datosUsuario } = req.body;

    const userName = User.generateUserName(name, lastName);

    const passwordLimpio = password?.trim() || "";
    const { salt, passwordHash } = User.crearPasswordSeguro(passwordLimpio);

    const nuevoUsuario = new User({
      userName,
      name,
      lastName,
      ...datosUsuario,
      salt,
      passwordHash,
    });

    await nuevoUsuario.save();

    res.status(201).json({ message: "Usuario creado con éxito", userName });
  } catch (error) {
    next(error);
  }
};

const editUser = async (req, res, next) => {
  try {
    const { password, ...userData } = req.body;

    const user = await User.findById(req.params.id);

    if (!user || user.status === "eliminado") {
      const error = new Error("Usuario no encontrado");
      error.status = 404;
      return next(error);
    }

    if (userData.name || userData.lastName) {
      const newName = userData.name || user.name;
      const newLastName = userData.lastName || user.lastName;
      userData.userName = await User.generateUserName(newName, newLastName);
    }

    if (password && password.trim() !== "") {
      const { salt, passwordHash } = User.crearPasswordSeguro(password.trim());
      userData.salt = salt;
      userData.passwordHash = passwordHash;
    }

    Object.assign(user, userData);
    await user.save();

    res
      .status(200)
      .json({ message: "Usuario actualizado", userName: user.userName });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || user.status === "eliminado") {
      const error = new Error("Usuario no encontrado");
      error.status = 404;
      return next(error);
    }

    user.status = "eliminado";
    await user.save();

    res.status(200).json({ message: "Usuario eliminado con éxito" });
  } catch (error) {
    next(error);
  }
};

export { getUsers, getUserById, createUser, editUser, deleteUser };
