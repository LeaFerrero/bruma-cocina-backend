import ERROR_CODES from "../constants/errorCodes.js";
import KNOWN_ERRORS from "../constants/knownErrors.js";
import { sendError } from "../utils/responses.js";

const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV !== "test") {
    console.error("Error capturado:", err);
  }

  const knownError = KNOWN_ERRORS[err.name];

  let statusCode = knownError?.statusCode || err.statusCode || 500;
  let status = statusCode.toString().startsWith("4") ? "fail" : "error";
  let message =
    knownError?.message || err.message || "Error interno del servidor";
  let details = err.details;
  let errorCode =
    knownError?.errorCode || err.errorCode || ERROR_CODES.INTERNAL_SERVER_ERROR;

  return sendError(res, statusCode, status, message, errorCode, details);
};

export { errorHandler };
