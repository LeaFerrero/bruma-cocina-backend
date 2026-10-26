import { body } from "express-validator";
import { validateFields } from "../validateFields.js";

const validateOrder = [
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

  body("phone")
    .notEmpty()
    .withMessage("El teléfono es obligatorio.")
    .isLength({ min: 10, max: 15 })
    .withMessage("El teléfono debe tener entre 10 y 15 caracteres.")
    .matches(/^\+?[0-9\s\-]+$/)
    .withMessage("Solo se permiten números, espacios, guiones y el símbolo +."),

  body("address")
    .trim()
    .notEmpty()
    .withMessage("La dirección es obligatoria.")
    .isLength({ min: 2, max: 100 })
    .withMessage("La dirección debe tener entre 2 y 100 caracteres."),

  body("notes")
    .trim()
    .isLength({ max: 250 })
    .withMessage("Las notas pueden tener como máximo 250 caracteres."),

  body("meals")
    .isArray({ min: 1 })
    .withMessage(
      "El carrito no puede estar vacío. Agregá al menos una vianda.",
    ),

  body("meals.*._id")
    .notEmpty()
    .withMessage("El ID de la vianda es obligatorio")
    .isString()
    .withMessage("El ID de la vianda debe ser texto"),

  body("meals.*.quantity")
    .notEmpty()
    .withMessage("La cantidad es obligatoria")
    .toInt()
    .isInt({ gt: 0 })
    .withMessage("La cantidad debe ser un número mayor a 0"),

  validateFields,
];

export { validateOrder };
