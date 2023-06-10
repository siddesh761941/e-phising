"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listFeedbackHandler = exports.addFeedbackHandler = void 0;
const mongo_connect_utils_1 = __importDefault(require("../utils/mongo-connect.utils"));
const addFeedbackHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const user = req === null || req === void 0 ? void 0 : req.user;
    const { feedback } = req.body;
    const db = yield mongo_connect_utils_1.default.getDB();
    try {
        const result = yield (db === null || db === void 0 ? void 0 : db.collection("feedback").insertOne({ feedback, user }));
        if (!result) {
            res.status(500).json({
                message: "Unable to add feedback, please try again later."
            });
        }
        res.status(200).json({
            message: "Feedback added successfully."
        });
    }
    catch (err) {
        return res.status(500).json({
            message: "Unable to add feedback, please try again later."
        });
    }
});
exports.addFeedbackHandler = addFeedbackHandler;
const listFeedbackHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield mongo_connect_utils_1.default.getDB();
    try {
        const feedbacks = yield (db === null || db === void 0 ? void 0 : db.collection("feedback").find({}).toArray());
        if (!feedbacks) {
            return res.status(404).json({ message: "0 feedbacks found." });
        }
        res.status(200).json({ feedbacks, message: "success" });
    }
    catch (err) {
        return res.status(500).json({
            message: "Unable to get feedbacks, please try again later."
        });
    }
});
exports.listFeedbackHandler = listFeedbackHandler;
