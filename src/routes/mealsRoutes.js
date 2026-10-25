import express from "express";
import { validateMeal } from "../middlewares/validators/validateMeal.js";
import { protectRoute, verifyRole } from "../middlewares/auth.js";
import { ROLES } from "../constants/roles.js";
import {
  getMeals,
  getMealById,
  createMeal,
  editMeal,
  deleteMeal,
} from "../controllers/mealsController.js";

const router = express.Router();

router.get("/", getMeals);

router.use(protectRoute);
router.use(verifyRole(ROLES.ADMIN, ROLES.STOCK));

router.get("/:id", getMealById);
router.post("/", validateMeal, createMeal);
router.patch("/:id", validateMeal, editMeal);
router.delete("/:id", deleteMeal);

export default router;
