import Meal from "../models/Meal.js";
import AppError from "../utils/AppError.js";
import { sendSuccess } from "../utils/responses.js";
import ERROR_CODES from "../constants/errorCodes.js";

const getMeals = async (req, res, next) => {
  try {
    const activeMeals = await Meal.find({
      status: "activo",
    });

    return sendSuccess(res, 200, "Viandas listados con éxito", activeMeals);
  } catch (error) {
    next(error);
  }
};

const getMealById = async (req, res, next) => {
  try {
    const meal = await Meal.findById(req.params.id).populate({
      path: "ingredients._id",
      select: "name unit",
    });

    if (!meal || meal.status === "eliminado") {
      throw new AppError(
        "Insumo no encontrado",
        404,
        null,
        ERROR_CODES.NOT_FOUND || "NOT_FOUND",
      );
    }

    return sendSuccess(res, 200, "Vianda encontrada", meal);
  } catch (error) {
    next(error);
  }
};

const createMeal = async (req, res, next) => {
  try {
    const { name, price, category, description, ingredients } = req.body;

    const newMeal = new Meal({
      name,
      price,
      category,
      description,
      ingredients,
    });

    await newMeal.save();

    return sendSuccess(res, 201, "Vianda creada con éxito", {
      meal: newMeal,
    });
  } catch (error) {
    next(error);
  }
};

const editMeal = async (req, res, next) => {
  try {
    const { name, price, category, description, ingredients } = req.body;

    const meal = await Meal.findById(req.params.id);

    if (!meal || meal.status === "eliminado") {
      throw new AppError(
        "Insumo no encontrado",
        404,
        null,
        ERROR_CODES.NOT_FOUND || "NOT_FOUND",
      );
    }

    if (name !== undefined) meal.name = name;
    if (price !== undefined) meal.price = price;
    if (category !== undefined) meal.category = category;
    if (description !== undefined) meal.description = description;
    if (ingredients !== undefined) meal.ingredients = ingredients;

    if (!meal.isModified()) {
      return sendSuccess(res, 200, "No se detectaron cambios para actualizar", {
        meal: meal,
      });
    }

    await meal.save();

    return sendSuccess(res, 200, "Vianda actualizado", {
      meal: meal,
    });
  } catch (error) {
    next(error);
  }
};

const deleteMeal = async (req, res, next) => {
  try {
    const meal = await Meal.findById(req.params.id);

    if (!meal || meal.status === "eliminado") {
      throw new AppError(
        "Vianda no encontrada",
        404,
        null,
        ERROR_CODES.NOT_FOUND || "NOT_FOUND",
      );
    }

    meal.status = "eliminado";
    await meal.save();

    return sendSuccess(res, 200, "Vianda eliminada con éxito", {
      meal: meal,
    });
  } catch (error) {
    next(error);
  }
};

export { getMeals, getMealById, createMeal, editMeal, deleteMeal };
