import { body } from "express-validator";
import validateFields from "../validateFields.js";

const validateLogin = [
  body("userName")
    .trim()
    .notEmpty()
    .withMessage("El nombre de usuario es obligatorio."),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("La contraseña es obligatoria."),

  validateFields,
];

export { validateLogin };
