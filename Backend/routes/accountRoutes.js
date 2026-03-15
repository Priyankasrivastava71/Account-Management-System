import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";

import {
  getBalance,
  getUsers,
  transferMoney,
  getStatement
} from "../controllers/accountController.js";

const router = express.Router();

router.get("/balance", authMiddleware, getBalance);
router.get("/users", authMiddleware, getUsers);
router.post("/transfer", authMiddleware, transferMoney);
router.get("/statement", authMiddleware, getStatement);

export default router;