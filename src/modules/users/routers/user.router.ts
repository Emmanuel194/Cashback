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
  checkEmailExists,
  resetPassword,
} from "../controllers/user.controller";

router.post("/resetPassword", resetPassword);
router.post("/checkEmailExists", checkEmailExists);
router.post("/users", createUser);
router.post("/session", login);
router.get("/users", getAllUsers);
router.get("/search", search);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.post("/authenticate", authenticate);

export default router;
