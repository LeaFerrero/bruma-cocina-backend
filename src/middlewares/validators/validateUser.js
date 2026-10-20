import { body } from "express-validator";
import { validateFields } from "../validateFields.js";
import { VALID_ROLES } from "../../constants/roles.js";

const validateUser = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio.")
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres."),

  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("El apellido es obligatorio.")
    .isLength({ min: 2, max: 50 })
    .withMessage("El apellido debe tener entre 2 y 50 caracteres."),

  body("role")
    .notEmpty()
    .withMessage("Debes seleccionar un rol.")
    .isIn(VALID_ROLES)
    .withMessage("El rol seleccionado no es válido."),

  body("password")
    .if(
      (value, { req }) => req.method === "POST" || (value && value.length > 0),
    )
    .isLength({ min: 8, max: 16 })
    .withMessage("La contraseña debe tener entre 8 y 16 caracteres."),

  validateFields,
];

export { validateUser };
