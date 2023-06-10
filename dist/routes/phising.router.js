"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const phising_controller_1 = require("../controllers/phising.controller");
const requireuser_1 = require("../middlewares/requireuser");
const isAdmin_1 = require("../middlewares/isAdmin");
const router = express_1.default.Router();
// Add a website link to the Database
router.post("/add", isAdmin_1.isAdmin, phising_controller_1.addLinkHandler);
// Remove a website link from the Database
router.delete("/remove/:linkId", isAdmin_1.isAdmin, phising_controller_1.removeLinkHandler);
// list all links
router.get("/list", isAdmin_1.isAdmin, phising_controller_1.listHandler);
// Check information about the website link
router.post("/checklink", requireuser_1.requireUser, phising_controller_1.checkWebsiteHandler);
// Update information about the website link
router.patch("/updatelink/:linkId", isAdmin_1.isAdmin, phising_controller_1.updateLinkHandler);
exports.default = router;
