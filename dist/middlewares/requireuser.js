"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireUser = void 0;
function requireUser(req, res, next) {
    // @ts-ignore
    console.log(res.cookie);
    // @ts-ignore
    if (!req.user) {
        return res.status(401).json({ message: "Invalid session" });
    }
    return next();
}
exports.requireUser = requireUser;
