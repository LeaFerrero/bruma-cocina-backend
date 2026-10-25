import Meal from "../models/Meal.js";
import AppError from "../utils/AppError.js";
import { sendSuccess } from "../utils/responses.js";
import ERROR_CODES from "../constants/errorCodes.js";

const getMeals = async (req, res, next) => {
  try {
    const activeMeals = await Meal.find({
      status: "activo",
    }).sort({ name: 1 });

    return sendSuccess(res, 200, "Viandas listados con éxito", activeMeals);
  } catch (error) {
    next(error);
  }
};

const getMealById = async (req, res, next) => {
  try {
    const meal = await Meal.findById(req.params.id).populate({
      path: "ingredients.supply",
      select: "name unit",
    });

    if (!meal || meal.status === "eliminado") {
      throw new AppError("Vianda no encontrada", 404, null, "NOT_FOUND");
    }

    const mealResponse = meal.toObject();
    mealResponse.ingredients = mealResponse.ingredients.map((ingredient) => ({
      _id: ingredient.supply._id,
      name: ingredient.supply.name,
      unit: ingredient.supply.unit,
      quantity: ingredient.quantity,
    }));

    return sendSuccess(res, 200, "Vianda encontrada", mealResponse);
  } catch (error) {
    next(error);
  }
};

const createMeal = async (req, res, next) => {
  try {
    const { name, price, category, description, ingredients } = req.body;

    const formattedIngredients = ingredients.map((ingredient) => ({
      supply: ingredient._id,
      quantity: ingredient.quantity,
    }));

    const newMeal = new Meal({
      name,
      price,
      category,
      description,
      ingredients: formattedIngredients,
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
        "Vianda no encontrada",
        404,
        null,
        ERROR_CODES.NOT_FOUND || "NOT_FOUND",
      );
    }

    if (name !== undefined) meal.name = name;
    if (price !== undefined) meal.price = price;
    if (description !== undefined) meal.description = description;

    if (category !== undefined) {
      const formattedCategory =
        typeof category === "string"
          ? category
              .split(",")
              .map((cat) => cat.trim())
              .filter((cat) => cat !== "")
          : category;

      const currentCat = Array.isArray(meal.category)
        ? meal.category
        : [meal.category];

      if (JSON.stringify(currentCat) !== JSON.stringify(formattedCategory)) {
        meal.category = formattedCategory;
      }
    }

    if (ingredients !== undefined) {
      const formattedIncomingIngredients = ingredients.map((item) => ({
        supply: (item._id || item.supply)?.toString(),
        quantity: Number(item.quantity),
      }));

      const currentClean = meal.ingredients.map((item) => ({
        supply: item.supply?.toString(),
        quantity: Number(item.quantity),
      }));

      if (
        JSON.stringify(currentClean) !==
        JSON.stringify(formattedIncomingIngredients)
      ) {
        meal.ingredients = formattedIncomingIngredients;
      }
    }

    if (!meal.isModified()) {
      return sendSuccess(res, 200, "No se detectaron cambios para actualizar", {
        meal: meal,
      });
    }

    await meal.save();

    return sendSuccess(res, 200, "Vianda actualizada", {
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
