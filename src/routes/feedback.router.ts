import express, { Router } from "express";

import {
  addFeedbackHandler,
  listFeedbackHandler
} from "../controllers/feedback.controller";
import { requireUser } from "../middlewares/requireuser";
import { isAdmin } from "../middlewares/isAdmin";

const router: Router = express.Router();

// Signup
router.post("/add", requireUser, addFeedbackHandler);

// Login
router.get("/list", isAdmin, listFeedbackHandler);

export default router;
