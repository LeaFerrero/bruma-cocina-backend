import express from "express";
import { validateLogin } from "../middlewares/validators/validateLogin.js";
import { login, logout, verifySession } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", validateLogin, login);
router.post("/logout", logout);
router.get("/verify", verifySession);

export default router;
