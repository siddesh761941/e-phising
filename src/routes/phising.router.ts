import express, { Router } from "express";

import {
  addLinkHandler,
  removeLinkHandler,
  listHandler,
  checkWebsiteHandler,
  updateLinkHandler
} from "../controllers/phising.controller";
import { requireUser } from "../middlewares/requireuser";
import { isAdmin } from "../middlewares/isAdmin";

const router: Router = express.Router();

// Add a website link to the Database
router.post("/add", isAdmin, addLinkHandler);

// Remove a website link from the Database
router.delete("/remove/:linkId", isAdmin, removeLinkHandler);

// list all links
router.get("/list", isAdmin, listHandler);

// Check information about the website link
router.post("/checklink", requireUser, checkWebsiteHandler);

// Update information about the website link
router.patch("/updatelink/:linkId", isAdmin, updateLinkHandler);

export default router;
