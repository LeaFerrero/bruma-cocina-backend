import express from "express";
import { validateMeal } from "../middlewares/validators/validateMeal.js";
import { parseMealData } from "../middlewares/parseMealData.js";
import { protectRoute, verifyRole } from "../middlewares/auth.js";
import { ROLES } from "../constants/roles.js";
import {
  getMeals,
  getMealById,
  createMeal,
  editMeal,
  deleteMeal,
} from "../controllers/mealsController.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

router.get("/", getMeals);

router.use(protectRoute);
router.use(verifyRole(ROLES.ADMIN, ROLES.STOCK));

router.get("/:id", getMealById);
router.post(
  "/",
  upload.single("image"),
  parseMealData,
  validateMeal,
  createMeal,
);
router.patch(
  "/:id",
  upload.single("image"),
  parseMealData,
  validateMeal,
  editMeal,
);
router.delete("/:id", deleteMeal);

export default router;
