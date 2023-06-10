import { NextFunction, Request, Response } from "express";
import { signJWT, verifyJWT } from "../utils/jwt.utils";

function deserializeUser(req: Request, res: Response, next: NextFunction) {
  const { accessToken, refreshToken } = req.cookies;

  if (!accessToken) {
    return next();
  }

  const { payload, expired } = verifyJWT(accessToken);

  // For a valid access token
  if (payload) {
    // @ts-ignore
    req.user = payload;
    return next();
  }

  // expired but valid access token

  const { payload: refresh } =
    expired && refreshToken ? verifyJWT(refreshToken) : { payload: null };

  if (!refresh) {
    return next();
  }

  // @ts-ignore
  req.user = payload;

  return next();
}

export default deserializeUser;
