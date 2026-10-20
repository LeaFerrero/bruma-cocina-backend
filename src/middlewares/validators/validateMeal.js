import { body } from "express-validator";
import { validateFields } from "../validateFields.js";

const validateMeal = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("El nombre de la vianda es obligatorio.")
    .isString()
    .withMessage("El nombre debe ser un texto.")
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres."),

  body("price")
    .notEmpty()
    .withMessage("El precio es obligatorio.")
    .customSanitizer((value) => parseDecimal(value, 2))
    .isFloat({ min: 0.01 })
    .withMessage("El precio no puede ser negativo o cero."),

  body("category")
    .isArray({ min: 1 })
    .withMessage("Debes enviar al menos una categoría en formato de lista."),

  body("category.*")
    .trim()
    .isString()
    .withMessage("Cada categoría debe ser un texto.")
    .isLength({ min: 3, max: 100 })
    .withMessage("Cada categoría debe tener entre 3 y 100 caracteres."),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("La descripción es obligatoria.")
    .isString()
    .withMessage("La descripción debe ser un texto.")
    .isLength({ min: 10, max: 250 })
    .withMessage("La descripción debe tener entre 10 y 250 caracteres."),

  body("ingredients")
    .notEmpty()
    .withMessage("Los ingredientes son obligatorios.")
    .isArray({ min: 1 })
    .withMessage(
      "Debe incluir al menos un ingrediente en formato de lista (array).",
    ),

  validateFields,
];

export { validateMeal };
