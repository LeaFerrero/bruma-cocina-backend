import { body } from "express-validator";
import validateFields from "../validateFields.js";

const validateUser = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio.")
    .isLength({ min: 2 })
    .withMessage("El nombre debe tener al menos 2 caracteres."),

  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("El apellido es obligatorio.")
    .isLength({ min: 2 })
    .withMessage("El apellido debe tener al menos 2 caracteres."),

  body("role").notEmpty().withMessage("Debes seleccionar un rol."),

  body("password")
    .if(
      (value, { req }) => req.method === "POST" || (value && value.length > 0),
    )
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres."),

  validateFields,
];

export { validateUser };
