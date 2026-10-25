import { body } from "express-validator";
import { validateFields } from "../validateFields.js";
import { parseDecimal } from "../../utils/parsers.js";

const validateMeal = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio.")
    .isString()
    .withMessage("El nombre debe ser un texto.")
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres."),

  body("price")
    .notEmpty()
    .withMessage("El precio es obligatorio.")
    .customSanitizer((value) => parseDecimal(value, 2))
    .isFloat({ min: 0.01 })
    .withMessage("El precio debe ser mayor a 0"),

  body("category")
    .isArray({ min: 1 })
    .withMessage("Debe ingresar al menos una categoría válida"),

  body("category.*")
    .trim()
    .isString()
    .withMessage("Cada categoría debe ser un texto.")
    .isLength({ min: 1 })
    .withMessage("La categoría no puede estar vacía."),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("La descripción es obligatoria.")
    .isString()
    .withMessage("La descripción debe ser un texto.")
    .isLength({ min: 10, max: 250 })
    .withMessage("La descripción debe tener entre 10 y 250 caracteres."),

  body("ingredients")
    .isArray({ min: 1 })
    .withMessage("Debe agregar al menos un ingrediente a la receta"),

  body("ingredients.*._id")
    .notEmpty()
    .withMessage("Falta la referencia al insumo")
    .isString()
    .withMessage("El ID del insumo debe ser texto"),

  body("ingredients.*.quantity")
    .notEmpty()
    .withMessage("La cantidad es obligatoria")
    .customSanitizer((value) => parseDecimal(value, 3))
    .isFloat({ min: 0.001 })
    .withMessage("La cantidad debe ser mayor a 0"),

  validateFields,
];

export { validateMeal };
