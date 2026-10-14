import express from "express";
import { login, logout } from "../controllers/authController";
import { validateLogin } from "../middlewares/validators/validateLogin";

const router = express.Router();

router.post("/", validateLogin, login);
router.post("/", logout);

export default router;
