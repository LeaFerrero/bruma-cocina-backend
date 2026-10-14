import { validationResult } from "express-validator";

const errorsMessages = validationResult.withDefaults({
  formatter: (error) => error.msg,
});

const validateFields = (req, res, next) => {
  const errors = errorsMessages(req);

  if (!errors.isEmpty()) {
    const error = new Error("Datos invalidos en el formulario");
    error.status = 400;
    error.validationData = errors.mapped();
    return next(error);
  }
  next();
};

export default validateFields;
