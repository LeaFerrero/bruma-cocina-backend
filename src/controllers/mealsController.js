import Meal from "../models/Meal.js";
import AppError from "../utils/AppError.js";
import { sendSuccess } from "../utils/responses.js";
import ERROR_CODES from "../constants/errorCodes.js";
import fs from "node:fs/promises";
import path from "node:path";

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

const getMealImages = async (req, res, next) => {
  try {
    const activeMeals = await Meal.find({
      status: "activo",
    })
      .select("title image")
      .sort({ name: 1 })
      .lean();

    return sendSuccess(
      res,
      200,
      "Imágenes de viandas obtenidas con éxito",
      activeMeals,
    );
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
    const { name, price, description, category, ingredients } = req.body;
    const imagePath = req.file ? req.file.filename : undefined;

    const newMeal = new Meal({
      name,
      price,
      description,
      category,
      ingredients,
      image: imagePath,
    });

    await newMeal.save();

    return sendSuccess(res, 201, "Vianda creada con éxito", { meal: newMeal });
  } catch (error) {
    if (req.file) {
      await fs.unlink(path.join("uploads", req.file.filename)).catch(() => {});
    }
    next(error);
  }
};

const editMeal = async (req, res, next) => {
  try {
    const { name, price, description, category, ingredients } = req.body;

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

    let oldImage = null;
    if (req.file) {
      oldImage = meal.image;
      meal.image = req.file.filename;
    }

    if (category !== undefined) {
      const parsedCategory =
        typeof category === "string" ? JSON.parse(category) : category;

      const formattedCategory =
        typeof parsedCategory === "string"
          ? parsedCategory
              .split(",")
              .map((cat) => cat.trim())
              .filter((cat) => cat !== "")
          : parsedCategory;

      const currentCat = Array.isArray(meal.category)
        ? meal.category
        : [meal.category];

      if (JSON.stringify(currentCat) !== JSON.stringify(formattedCategory)) {
        meal.category = formattedCategory;
      }
    }

    if (ingredients !== undefined) {
      const parsedIngredients =
        typeof ingredients === "string" ? JSON.parse(ingredients) : ingredients;

      const formattedIncomingIngredients = parsedIngredients.map((item) => ({
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

    if (oldImage) {
      await fs.unlink(path.join("uploads", oldImage)).catch(() => {});
    }

    return sendSuccess(res, 200, "Vianda actualizada", {
      meal: meal,
    });
  } catch (error) {
    if (req.file) {
      await fs.unlink(path.join("uploads", req.file.filename)).catch(() => {});
    }
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

export {
  getMeals,
  getMealImages,
  getMealById,
  createMeal,
  editMeal,
  deleteMeal,
};
