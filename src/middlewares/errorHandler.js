const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV !== "test") {
    console.error("Error capturado:", err);
  }

  if (err.validationData) {
    return res.status(400).json({
      error: "Datos invalidos",
      message: err.validationData,
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      error: "ID inválido",
      message: "El formato del ID proporcionado no es válido",
    });
  }

  if (
    err.status === 400 ||
    err.status === 401 ||
    err.status === 403 ||
    err.status === 404
  ) {
    return res.status(err.status).json({
      error: `Error ${err.status}`,
      message: err.message,
    });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      error: "No autorizado",
      message: "Firma de token inválida",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      error: "Sesión expirada",
      message: "El token ha caducado, por favor inicie sesión nuevamente",
    });
  }

  res.status(500).json({
    error: "Error interno",
    message: "Ocurrió un problema técnico. Por favor, intente más tarde.",
  });
};

export { errorHandler };
