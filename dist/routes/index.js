"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_router_1 = __importDefault(require("./user.router"));
const phising_router_1 = __importDefault(require("./phising.router"));
const feedback_router_1 = __importDefault(require("./feedback.router"));
const routes = (app) => {
    app.use("/api/v1/user", user_router_1.default);
    app.use("/api/v1/links", phising_router_1.default);
    app.use("/api/v1/feedback", feedback_router_1.default);
};
exports.default = routes;
