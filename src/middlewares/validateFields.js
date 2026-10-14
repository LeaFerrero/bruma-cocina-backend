import { validationResult } from "express-validator";

const validateFields = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const message = errors
      .array()
      .map((e) => e.msg)
      .join("\n");
    const error = new Error(message);
    error.status = 400;
    return next(error);
  }
  next();
};

export default validateFields;
