import AppError from "../utils/AppError.js";
import ERROR_CODES from "../constants/errorCodes.js";

export const parseMealData = (req, res, next) => {
  if (req.body.mealData) {
    try {
      const parsed = JSON.parse(req.body.mealData);

      req.body.name = parsed.name;
      req.body.price = parsed.price;
      req.body.minStock = parsed.minStock;
      req.body.description = parsed.description;
      req.body.category = parsed.category;

      if (parsed.ingredients && Array.isArray(parsed.ingredients)) {
        req.body.ingredients = parsed.ingredients.map((item) => ({
          supply: item._id,
          quantity: item.quantity,
        }));
      } else {
        req.body.ingredients = [];
      }
    } catch (error) {
      return next(
        new AppError(
          "El formato de mealData es inválido",
          400,
          null,
          ERROR_CODES.BAD_REQUEST,
        ),
      );
    }
  }
  next();
};
