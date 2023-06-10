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
exports.generateRandomNumber = exports.compareHash = exports.hashfunction = exports.fetchRetry = exports.hmsHeaders = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
require("dotenv").config();
const hmsHeaders = () => {
    return {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.MANAGEMENT_TOKEN}`
        }
    };
};
exports.hmsHeaders = hmsHeaders;
const fetchRetry = (count, fn, params) => __awaiter(void 0, void 0, void 0, function* () {
    for (let i = 0; i < count; i++) {
        const data = yield fn(params === null || params === void 0 ? void 0 : params.join(","));
        if (data) {
            return data;
        }
    }
    return null;
});
exports.fetchRetry = fetchRetry;
const hashfunction = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const saltRounds = 10;
    const salt = yield bcryptjs_1.default.genSalt(saltRounds);
    try {
        const hash = yield bcryptjs_1.default.hash(password, salt);
        return hash;
    }
    catch (err) {
        return false;
    }
});
exports.hashfunction = hashfunction;
const compareHash = (password, hash) => {
    try {
        const result = bcryptjs_1.default.compareSync(password, hash);
        return result;
    }
    catch (err) {
        return "error";
    }
};
exports.compareHash = compareHash;
// Generate random numbers
const generateRandomNumber = (length) => Math.random().toFixed(length).split(".")[1];
exports.generateRandomNumber = generateRandomNumber;
