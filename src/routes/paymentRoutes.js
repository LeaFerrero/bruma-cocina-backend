import { Router } from "express";
import { validatePayment } from "../middlewares/validators/validatePayment.js";
import { protectRoute, verifyRole } from "../middlewares/auth.js";
import { createPayment } from "../controllers/paymentController.js";
import { ROLES } from "../constants/roles.js";

const router = Router();

router.use(protectRoute);
router.use(verifyRole(ROLES.ADMIN, ROLES.CAJA));

router.post("/", validatePayment, createPayment);

export default router;
