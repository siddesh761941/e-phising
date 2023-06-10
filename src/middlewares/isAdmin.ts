import { NextFunction, Request, Response } from "express";

export function isAdmin(req: Request, res: Response, next: NextFunction) {
  const { role } = req.cookies;
  // @ts-ignore
  if (!req.user) {
    return res.status(401).json({ message: "Invalid session" });
  }

  if (role !== "admin") {
    return res.status(401).send("You are not authorized to do this action");
  }

  return next();
}
