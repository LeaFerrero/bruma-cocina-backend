import express from "express";
import { validateOrder } from "../middlewares/validators/validateOrder.js";
import { protectRoute, verifyRole } from "../middlewares/auth.js";
import { ROLES } from "../constants/roles.js";
import {
  getOrders,
  getOrderById,
  createOrder,
  dispatchOrder,
  cancelOrder,
} from "../controllers/ordersController.js";

const router = express.Router();

router.post("/", validateOrder, createOrder);

router.use(protectRoute);
router.use(verifyRole(ROLES.ADMIN, ROLES.COCINA, ROLES.CAJA));

router.get("/", getOrders);
router.get("/:id", getOrderById);
router.patch("/:id/dispatch", dispatchOrder);
router.patch("/:id/cancel", cancelOrder);

export default router;
