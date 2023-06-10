"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
function isAdmin(req, res, next) {
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
exports.isAdmin = isAdmin;
