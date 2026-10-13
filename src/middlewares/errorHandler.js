const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV !== "test") {
    console.error("Error capturado:", err);
  }

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(" - ");

    return res.status(400).json({
      error: "Error de validación",
      message,
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

  res.status(500).json({
    error: "Error interno",
    message: "Ocurrió un problema técnico. Por favor, intente más tarde.",
  });
};

export { errorHandler };
