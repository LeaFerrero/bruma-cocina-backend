/**
 * Envía una respuesta HTTP exitosa estandarizada.
 *
 * @param {object} res - El objeto de respuesta nativo de Express.
 * @param {number} statusCode - Código de estado HTTP (ej. 200, 201).
 * @param {string} message - Mensaje descriptivo para el cliente.
 * @param {object|array|null} [data=null] - (Opcional) La carga útil de datos a enviar.
 * @returns {object} Respuesta JSON de Express.
 */
const sendSuccess = (res, statusCode, message, data = null) => {
  return res.status(statusCode).json({
    status: "success",
    message,
    data,
  });
};

/**
 * Envía una respuesta HTTP de error estandarizada.
 *
 * @param {object} res - El objeto de respuesta nativo de Express.
 * @param {number} statusCode - Código de estado HTTP (ej. 400, 404, 500).
 * @param {string} status - Clasificación del error ("fail" para 4xx, "error" para 500).
 * @param {string} message - Mensaje descriptivo del problema.
 * @param {string|null} [errorCode=null] - (Opcional) Código interno para el frontend (ej. "VALIDATION_ERROR").
 * @param {array|object|null} [details=null] - (Opcional) Detalles extra, como una lista de campos inválidos.
 * @returns {object} Respuesta JSON de Express.
 */
const sendError = (
  res,
  statusCode,
  status,
  message,
  errorCode = null,
  details = null,
) => {
  return res.status(statusCode).json({ status, message, errorCode, details });
};

export { sendSuccess, sendError };
