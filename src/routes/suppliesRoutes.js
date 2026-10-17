import express from "express";
import { ROLES } from "../constants/roles.js";
import {
  getSupplies,
  getSupplyById,
  createSupply,
  editSupply,
  deleteSupply,
} from "../controllers/suppliesController.js";

import { protectRoute, verifyRole } from "../middlewares/auth.js";

const router = express.Router();

router.use(protectRoute);
router.use(verifyRole(ROLES.ADMIN, ROLES.STOCK));

router.get("/", getSupplies);
router.get("/:id", getSupplyById);
router.post("/", createSupply);
router.patch("/:id", editSupply);
router.delete("/:id", deleteSupply);

export default router;
