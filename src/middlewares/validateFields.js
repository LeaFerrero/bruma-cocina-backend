import { validationResult } from "express-validator";

const validateFields = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const message = errors
      .array()
      .map((e) => e.message)
      .join("-");
    const error = new Error(message);
    error.status = 404;
    return next(error);
  }
};

export default validateFields;
