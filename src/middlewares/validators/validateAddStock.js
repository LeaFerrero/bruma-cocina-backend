import { body } from "express-validator";
import { validateFields } from "../validateFields.js";

const validateAddStock = [
  body("items")
    .isArray({ min: 1 })
    .withMessage("Debe enviar una lista de insumos con al menos un ítem."),

  body("items.*._id")
    .isMongoId()
    .withMessage("Uno o más insumos tienen un ID inválido."),

  body("items.*.quantity")
    .notEmpty()
    .withMessage("La cantidad es obligatoria")
    .replace(",", ".")
    .isFloat({ min: 0.001 })
    .withMessage("La cantidad tiene que ser mayor a 0")
    .isDecimal({ decimal_digits: "0,3" })
    .withMessage("La cantidad debe tener un máximo de 3 decimales."),

  validateFields,
];

export { validateAddStock };
