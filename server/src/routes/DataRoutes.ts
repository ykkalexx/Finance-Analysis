import {
  monthlySumController,
  commonTransactionController,
  analyzeDataController,
} from "../controllers/DataControllers";
import express from "express";

const router = express.Router();

router.post("/monthly-sum", monthlySumController);

router.post("/monthly-common", commonTransactionController);

router.post("/analyze", analyzeDataController);

export default router;
