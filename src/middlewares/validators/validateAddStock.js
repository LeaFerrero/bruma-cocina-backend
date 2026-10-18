import { body } from "express-validator";
import validateFields from "../validateFields.js";

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
    .isFloat({ min: 0 })
    .withMessage("La cantidad no puede ser negativa.")
    .isDecimal({ decimal_digits: "0,3" })
    .withMessage("La cantidad debe tener un máximo de 3 decimales."),

  validateFields,
];

export default validateAddStock;
