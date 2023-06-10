"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const feedback_controller_1 = require("../controllers/feedback.controller");
const requireuser_1 = require("../middlewares/requireuser");
const isAdmin_1 = require("../middlewares/isAdmin");
const router = express_1.default.Router();
// Signup
router.post("/add", requireuser_1.requireUser, feedback_controller_1.addFeedbackHandler);
// Login
router.get("/list", isAdmin_1.isAdmin, feedback_controller_1.listFeedbackHandler);
exports.default = router;
