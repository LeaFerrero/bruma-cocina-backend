import { body } from "express-validator";
import { validateFields } from "../validateFields.js";
import { parseDecimal } from "../../utils/parsers.js";

const validateSupply = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio.")
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres."),

  body("unit")
    .notEmpty()
    .withMessage("Debes seleccionar una unidad de medida."),

  body("price")
    .notEmpty()
    .withMessage("El precio es obligatorio.")
    .customSanitizer((value) => parseDecimal(value, 2))
    .isFloat({ min: 0.01 })
    .withMessage("El precio no puede ser negativo o cero."),

  body("currentStock")
    .notEmpty()
    .withMessage("El stock actual es obligatorio.")
    .customSanitizer((value) => parseDecimal(value, 3))
    .isFloat({ min: 0 })
    .withMessage("El stock actual no puede ser negativo."),

  body("minStock")
    .notEmpty()
    .withMessage("El stock mínimo es obligatorio.")
    .customSanitizer((value) => parseDecimal(value, 3))
    .isFloat({ min: 0 })
    .withMessage("El stock mínimo no puede ser negativo."),

  validateFields,
];

export { validateSupply };
