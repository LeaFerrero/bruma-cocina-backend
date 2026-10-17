import express from "express";
import { validateUser } from "../middlewares/validators/validateUser.js";
import { protectRoute, verifyRole } from "../middlewares/auth.js";
import { ROLES } from "../constants/roles.js";

import {
  getUsers,
  getUserById,
  createUser,
  editUser,
  deleteUser,
} from "../controllers/usersController.js";

const router = express.Router();

router.use(protectRoute);
router.use(verifyRole(ROLES.ADMIN));

router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", validateUser, createUser);
router.patch("/:id", validateUser, editUser);
router.delete("/:id", deleteUser);

export default router;
