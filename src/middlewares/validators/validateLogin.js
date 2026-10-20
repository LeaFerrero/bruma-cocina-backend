import { body } from "express-validator";
import { validateFields } from "../validateFields.js";

const validateLogin = [
  body("userName")
    .trim()
    .notEmpty()
    .withMessage("El nombre de usuario es obligatorio.")
    .isString()
    .withMessage("El nombre de usuario debe ser un texto.")
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre de usuario debe tener entre 2 y 50 caracteres."),

  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria.")
    .isString()
    .withMessage("La contraseña debe ser un texto.")
    .isLength({ min: 8, max: 16 })
    .withMessage("La contraseña debe tener entre 8 y 16 caracteres."),

  validateFields,
];

export { validateLogin };
