import {
  monthlySumController,
  commonTransactionController,
} from "../controllers/DataControllers";
import express from "express";

const router = express.Router();

router.post("/monthly-sum", monthlySumController);

router.post("/monthly-common", commonTransactionController);

export default router;
