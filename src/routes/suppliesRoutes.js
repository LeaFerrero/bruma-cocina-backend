import express from "express";
import { validateSupply } from "../middlewares/validators/validateSupply.js";
import validateAddStock from "../middlewares/validators/validateAddStock.js";
import { ROLES } from "../constants/roles.js";
import {
  getSupplies,
  getSupplyById,
  createSupply,
  editSupply,
  deleteSupply,
  addStock,
} from "../controllers/suppliesController.js";

import { protectRoute, verifyRole } from "../middlewares/auth.js";

const router = express.Router();

router.use(protectRoute);
router.use(verifyRole(ROLES.ADMIN, ROLES.STOCK));

router.get("/", getSupplies);
router.get("/:id", getSupplyById);
router.post("/", validateSupply, createSupply);
router.patch("/:id", validateSupply, editSupply);
router.delete("/:id", deleteSupply);
router.patch("/", validateAddStock, addStock);

export default router;
