import { Express } from "express";

import userRouter from "./user.router";
import phisingRouter from "./phising.router";
import feedbackRouter from "./feedback.router";

const routes = (app: Express) => {
  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/links", phisingRouter);
  app.use("/api/v1/feedback", feedbackRouter);
};

export default routes;
