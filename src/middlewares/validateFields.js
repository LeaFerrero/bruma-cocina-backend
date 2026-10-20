import { validationResult } from "express-validator";
import AppError from "../utils/AppError.js";
import ERROR_CODES from "../constants/errorCodes.js";

const errorsMessages = validationResult.withDefaults({
  formatter: (error) => error.msg,
});

const validateFields = (req, res, next) => {
  const errors = errorsMessages(req);

  if (!errors.isEmpty()) {
    const error = new AppError(
      "Datos inválidos en el formulario",
      400,
      errors.mapped(),
      ERROR_CODES.VALIDATION_ERROR || "VALIDATION_ERROR",
    );

    return next(error);
  }

  next();
};

export { validateFields };
