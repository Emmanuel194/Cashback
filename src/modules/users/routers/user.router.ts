import express from "express";
// import { requestPasswordReset } from "../controllers/user.controller";
const router = express.Router();

import {
  createUser,
  login,
  getAllUsers,
  search,
  updateUser,
  deleteUser,
  authenticate,
} from "../controllers/user.controller";

// router.post("/forgot-password", requestPasswordReset);
router.post("/users", createUser);
router.post("/session", login);
router.get("/users", getAllUsers);
router.get("/search", search);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.post("/authenticate", authenticate);

export default router;
