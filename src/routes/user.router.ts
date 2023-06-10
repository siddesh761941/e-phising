import express, { Router } from "express";

import {
  signupHandler,
  loginHandler,
  logoutHandler,
  forgotPasswordHandler,
  usersListHandler,
  changePasswordHandler
} from "../controllers/user.controller";
import { requireUser } from "../middlewares/requireuser";
import { isAdmin } from "../middlewares/isAdmin";

const router: Router = express.Router();

// Signup
router.post("/signup", signupHandler);

// Login
router.post("/login", loginHandler);

// Logout
router.get("/logout", requireUser, logoutHandler);

// Forgot password
router.post("/forgotpassword", forgotPasswordHandler);

// Get users list
router.get("/list", isAdmin, usersListHandler);

// Chnage password
router.post("/changepassword", requireUser, changePasswordHandler);

router.get("/valid", requireUser, (req, res) => {
  // @ts-ignore
  res.status(200).send({ ...req?.user, message: "success" });
});

export default router;
