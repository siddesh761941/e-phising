import { NextFunction, Request, Response } from "express";

export function requireUser(req: Request, res: Response, next: NextFunction) {
  // @ts-ignore
  console.log(res.cookie);
  // @ts-ignore
  if (!req.user) {
    return res.status(401).json({ message: "Invalid session" });
  }

  return next();
}
