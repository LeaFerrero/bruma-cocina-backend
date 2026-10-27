import Meal from "../models/Meal.js";
import Supply from "../models/Supply.js";
import AppError from "../utils/AppError.js";
import { sendSuccess } from "../utils/responses.js";
import ERROR_CODES from "../constants/errorCodes.js";
import { parseDecimal } from "../utils/parsers.js";

export const registerProduction = async (req, res, next) => {
  try {
    const { meals } = req.body;

    if (!meals || meals.length === 0) {
      throw new AppError(
        "La lista de viandas esta vacia.",
        400,
        null,
        ERROR_CODES.BAD_REQUEST,
      );
    }

    const requiredIngredients = {};

    for (const item of meals) {
      const meal = await Meal.findById(item._id);

      if (!meal) {
        throw new AppError(
          "Vianda no encontrada.",
          404,
          null,
          ERROR_CODES.NOT_FOUND,
        );
      }

      for (const ingredient of meal.ingredients) {
        const ingredientId = ingredient.supply.toString();
        const totalNeeded = ingredient.quantity * item.quantity;

        if (requiredIngredients[ingredientId]) {
          requiredIngredients[ingredientId] += totalNeeded;
        } else {
          requiredIngredients[ingredientId] = totalNeeded;
        }
      }
    }

    for (const [ingredientId, amountNeeded] of Object.entries(
      requiredIngredients,
    )) {
      const ingredient = await Supply.findById(ingredientId);

      if (!ingredient) {
        throw new AppError(
          "Insumo no encontrado.",
          404,
          null,
          ERROR_CODES.NOT_FOUND,
        );
      }

      if (ingredient.currentStock < amountNeeded) {
        throw new AppError(
          `Stock insuficiente para ${ingredient.name}. Se necesitan ${amountNeeded.toFixed(3)}${ingredient.unit} pero solo hay ${ingredient.currentStock.toFixed(3)}${ingredient.unit}.`,
          400,
          null,
          ERROR_CODES.INSUFFICIENT_STOCK,
        );
      }
    }

    for (const [ingredientId, amountNeeded] of Object.entries(
      requiredIngredients,
    )) {
      const ingredient = await Supply.findById(ingredientId);

      const newStock = parseDecimal(ingredient.currentStock - amountNeeded, 3);

      await Supply.findByIdAndUpdate(ingredientId, {
        $set: { currentStock: newStock },
      });
    }

    for (const item of meals) {
      await Meal.findByIdAndUpdate(item._id, {
        $inc: { currentStock: item.quantity },
      });
    }

    const io = req.app.get("io");
    if (io) {
      io.emit("production-updated");
    }

    return sendSuccess(
      res,
      201,
      "Producción registrada y stock actualizado con éxito.",
    );
  } catch (error) {
    next(error);
  }
};
