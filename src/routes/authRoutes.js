import express from "express";
import { login, logout } from "../controllers/authController.js";
import { validateLogin } from "../middlewares/validators/validateLogin.js";

const router = express.Router();

router.post("/login", validateLogin, login);
router.post("/logout", logout);

export default router;
