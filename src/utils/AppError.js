class AppError extends Error {
  /**
   * Crea un error personalizado para la aplicación.
   *
   * @param {string} message - Mensaje descriptivo del error para el frontend.
   * @param {number} statusCode - Código de estado HTTP (ej. 400, 404, 500).
   * @param {object|null} [details=null] - (Opcional) Array u objeto con errores de validación.
   * @param {string|null} [errorCode=null] - (Opcional) Código interno del error (ej. "USER_NOT_FOUND").
   */
  constructor(message, statusCode, details = null, errorCode = null) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
    this.errorCode = errorCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
