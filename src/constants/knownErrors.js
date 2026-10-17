import ERROR_CODES from "./errorCodes.js";

const KNOWN_ERRORS = Object.freeze({
  CastError: {
    statusCode: 400,
    message: "El formato del ID proporcionado no es válido",
    errorCode: ERROR_CODES.INVALID_ID,
  },
  JsonWebTokenError: {
    statusCode: 401,
    message: "Firma de token inválida",
    errorCode: ERROR_CODES.INVALID_TOKEN,
  },
  TokenExpiredError: {
    statusCode: 401,
    message: "El token ha caducado, por favor inicie sesión nuevamente",
    errorCode: ERROR_CODES.TOKEN_EXPIRED,
  },
});

export default KNOWN_ERRORS;
