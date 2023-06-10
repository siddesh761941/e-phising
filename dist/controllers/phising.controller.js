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
exports.updateLinkHandler = exports.checkWebsiteHandler = exports.listHandler = exports.removeLinkHandler = exports.addLinkHandler = void 0;
const mongodb_1 = require("mongodb");
const mongo_connect_utils_1 = __importDefault(require("../utils/mongo-connect.utils"));
const addLinkHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { link, description, isSecured } = req.body;
    const db = yield mongo_connect_utils_1.default.getDB();
    try {
        const isLinkAlreadyExist = yield (db === null || db === void 0 ? void 0 : db.collection("links").findOne({ link }));
        if (isLinkAlreadyExist) {
            return res.status(409).json({ message: "Link already exist" });
        }
        const result = yield (db === null || db === void 0 ? void 0 : db.collection("links").insertOne({ link, description, isSecured }));
        if (!result) {
            return res.status(500).json({
                message: "Unable to add link, please try again later."
            });
        }
        res.status(200).json({
            message: "Link added to the phising website list successfully."
        });
    }
    catch (err) {
        return res.status(500).json({
            message: "Unable to add link, please try again later."
        });
    }
});
exports.addLinkHandler = addLinkHandler;
const removeLinkHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { linkId } = req.params;
    const db = yield mongo_connect_utils_1.default.getDB();
    try {
        const isLinkAlreadyExist = yield (db === null || db === void 0 ? void 0 : db.collection("links").findOne({ _id: new mongodb_1.ObjectId(linkId) }));
        if (!isLinkAlreadyExist) {
            return res
                .status(404)
                .json({ message: "Link doesn't exist in our Database" });
        }
        const result = yield (db === null || db === void 0 ? void 0 : db.collection("links").deleteOne({ _id: new mongodb_1.ObjectId(linkId) }));
        if (!result) {
            res.status(500).json({
                message: "Unable to remove link, please try again later."
            });
        }
        res.status(200).json({
            message: "Link removed successfully."
        });
    }
    catch (err) {
        return res.status(500).json({
            message: "Unable to remove link, please try again later."
        });
    }
});
exports.removeLinkHandler = removeLinkHandler;
const listHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield mongo_connect_utils_1.default.getDB();
    try {
        const links = yield (db === null || db === void 0 ? void 0 : db.collection("links").aggregate([{ $sample: { size: 30 } }]).limit(30).toArray());
        if (!links) {
            return res.status(404).json({ message: "0 Links found." });
        }
        res.status(200).json({ links, message: "success" });
    }
    catch (err) {
        return res.status(500).json({
            message: "Unable to get links, please try again later."
        });
    }
});
exports.listHandler = listHandler;
const checkWebsiteHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield mongo_connect_utils_1.default.getDB();
    const { link } = req.body;
    try {
        const linkDetails = yield (db === null || db === void 0 ? void 0 : db.collection("links").findOne({ link }));
        if (!linkDetails) {
            return res.status(404).json({
                message: "There is no information about the given website, request admin to add the details about the website."
            });
        }
        res.status(200).json({ linkDetails, message: "success" });
    }
    catch (err) {
        return res.status(500).json({
            message: "Unable to get the link details, please try again later."
        });
    }
});
exports.checkWebsiteHandler = checkWebsiteHandler;
const updateLinkHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield mongo_connect_utils_1.default.getDB();
    const { description } = req.body;
    const { linkId } = req.params;
    console.log(linkId, description);
    try {
        const result = yield db
            .collection("links")
            .updateOne({ _id: new mongodb_1.ObjectId(linkId) }, { $set: { description } });
        console.log(result);
        return res.status(200).json({ message: "success" });
    }
    catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateLinkHandler = updateLinkHandler;
