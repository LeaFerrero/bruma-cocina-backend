import { body } from "express-validator";
import { validateFields } from "../validateFields.js";
import { VALID_PAYMENT_METHODS } from "../../constants/paymentMethods.js";
import { VALID_PAYMENT_STATUS } from "../../constants/paymentStatus.js";

const validatePayment = [
  body("order")
    .notEmpty()
    .withMessage("El ID de la orden es obligatorio.")
    .isMongoId()
    .withMessage("El ID de la orden no es válido."),

  body("totalAmount")
    .notEmpty()
    .withMessage("El monto total es obligatorio.")
    .isNumeric()
    .withMessage("El monto total debe ser un número.")
    .toFloat()
    .isFloat({ gt: 0 })
    .withMessage("El monto total debe ser mayor a 0."),

  body("paymentMethod")
    .notEmpty()
    .withMessage("El método de pago es obligatorio.")
    .isIn(VALID_PAYMENT_METHODS)
    .withMessage("El método de pago ingresado no es válido."),

  body("paymentStatus")
    .optional()
    .isIn(VALID_PAYMENT_STATUS)
    .withMessage("El estado de pago no es válido."),

  body("paidAt").notEmpty().withMessage("La fecha del pago es obligatoria."),

  validateFields,
];

export { validatePayment };
