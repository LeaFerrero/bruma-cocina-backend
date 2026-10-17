import { body } from "express-validator";
import validateFields from "../validateFields.js";

const validateSupply = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio.")
    .isLength({ min: 2 })
    .withMessage("El nombre debe tener al menos 2 caracteres."),

  body("unit")
    .notEmpty()
    .withMessage("Debes seleccionar una unidad de medida."),

  body("price")
    .notEmpty()
    .withMessage("El precio es obligatorio.")
    .replace(",", ".")
    .isFloat({ min: 0 })
    .withMessage("El precio no puede ser negativo.")
    .isDecimal({ decimal_digits: "0,2" })
    .withMessage("El precio debe tener un máximo de 2 decimales."),

  body("currentStock")
    .notEmpty()
    .withMessage("El stock actual es obligatorio.")
    .replace(",", ".")
    .isFloat({ min: 0 })
    .withMessage("El stock actual no puede ser negativo.")
    .isDecimal({ decimal_digits: "0,3" })
    .withMessage("El stock actual debe tener un máximo de 3 decimales."),

  body("minStock")
    .notEmpty()
    .withMessage("El stock mínimo es obligatorio.")
    .replace(",", ".")
    .isFloat({ min: 0 })
    .withMessage("El stock mínimo no puede ser negativo.")
    .isDecimal({ decimal_digits: "0,3" })
    .withMessage("El stock mínimo debe tener un máximo de 3 decimales."),

  validateFields,
];

export { validateSupply };
