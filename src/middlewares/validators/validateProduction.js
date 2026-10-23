import { body } from "express-validator";

const validateRegisterProduction = [
  body("items")
    .exists()
    .withMessage("El campo 'items' es obligatorio.")
    .isArray({ min: 1 })
    .withMessage("Debe enviar al menos una vianda en el arreglo 'items'."),

  body("items.*._id")
    .exists()
    .withMessage("El ID de la vianda es obligatorio.")
    .isMongoId()
    .withMessage("El ID de la vianda no tiene un formato de MongoDB válido."),

  body("items.*.quantity")
    .exists()
    .withMessage("La cantidad es obligatoria.")
    .isInt({ gt: 0 })
    .withMessage("La cantidad debe ser un número entero mayor a cero.")
    .toInt(),
];

export { validateRegisterProduction };
