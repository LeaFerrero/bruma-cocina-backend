import { validationResult } from "express-validator";
import fs from "fs";
import AppError from "../utils/AppError.js";
import ERROR_CODES from "../constants/errorCodes.js";

const errorsMessages = validationResult.withDefaults({
  formatter: (error) => error.msg,
});

const validateFields = (req, res, next) => {
  const errors = errorsMessages(req);

  if (!errors.isEmpty()) {
    // Si la validación falla y Multer subió una imagen, la borramos del disco para que no sea huérfana
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error("Error al eliminar la imagen huérfana:", err);
        }
      });
    }

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
