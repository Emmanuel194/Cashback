import express from "express";

const router = express.Router();

import {
  createUser,
  getAllUsers,
  search,
  updateUser,
  deleteUser,
  authenticate,
} from "../controllers/user.controller";

router.post("/users", createUser);
router.get("/users", getAllUsers);
router.get("/search", search);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.post("/authenticate", authenticate);

export default router;
