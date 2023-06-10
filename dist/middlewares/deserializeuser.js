"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_utils_1 = require("../utils/jwt.utils");
function deserializeUser(req, res, next) {
    const { accessToken, refreshToken } = req.cookies;
    if (!accessToken) {
        return next();
    }
    const { payload, expired } = (0, jwt_utils_1.verifyJWT)(accessToken);
    // For a valid access token
    if (payload) {
        // @ts-ignore
        req.user = payload;
        return next();
    }
    // expired but valid access token
    const { payload: refresh } = expired && refreshToken ? (0, jwt_utils_1.verifyJWT)(refreshToken) : { payload: null };
    if (!refresh) {
        return next();
    }
    // @ts-ignore
    req.user = payload;
    return next();
}
exports.default = deserializeUser;
