"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const requireuser_1 = require("../middlewares/requireuser");
const isAdmin_1 = require("../middlewares/isAdmin");
const router = express_1.default.Router();
// Signup
router.post("/signup", user_controller_1.signupHandler);
// Login
router.post("/login", user_controller_1.loginHandler);
// Logout
router.get("/logout", requireuser_1.requireUser, user_controller_1.logoutHandler);
// Forgot password
router.post("/forgotpassword", user_controller_1.forgotPasswordHandler);
// Get users list
router.get("/list", isAdmin_1.isAdmin, user_controller_1.usersListHandler);
// Chnage password
router.post("/changepassword", requireuser_1.requireUser, user_controller_1.changePasswordHandler);
router.get("/valid", requireuser_1.requireUser, (req, res) => {
    // @ts-ignore
    res.status(200).send(Object.assign(Object.assign({}, req === null || req === void 0 ? void 0 : req.user), { message: "success" }));
});
exports.default = router;
