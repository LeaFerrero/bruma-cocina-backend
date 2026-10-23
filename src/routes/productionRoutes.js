import express from "express";
import { validateRegisterProduction } from "../middlewares/validators/validateProduction.js";
import { protectRoute, verifyRole } from "../middlewares/auth.js";
import { ROLES } from "../constants/roles.js";
import { registerProduction } from "../controllers/productionController.js";

const router = express.Router();

router.use(protectRoute);
router.use(verifyRole(ROLES.ADMIN, ROLES.COCINA));

router.post("/", validateRegisterProduction, registerProduction);

export default router;
