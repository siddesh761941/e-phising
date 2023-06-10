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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersListHandler = exports.forgotPasswordHandler = exports.setPassword = exports.changePasswordHandler = exports.logoutHandler = exports.loginHandler = exports.signupHandler = void 0;
const mongo_connect_utils_1 = __importDefault(require("../utils/mongo-connect.utils"));
const jwt_utils_1 = require("../utils/jwt.utils");
const common_utils_1 = require("../utils/common.utils");
const mail_utils_1 = require("../utils/mail.utils");
const addUser = (db, name, email, password, verified, role, rest) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (db === null || db === void 0 ? void 0 : db.collection("users").insertOne(Object.assign({ email, name, password, verified, role }, rest)));
        return result;
    }
    catch (err) {
        return false;
    }
});
const signupHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { email, name, password, role } = _a, rest = __rest(_a, ["email", "name", "password", "role"]);
    const db = yield mongo_connect_utils_1.default.getDB();
    // Check user exists or not
    try {
        const user = yield (db === null || db === void 0 ? void 0 : db.collection("users").findOne({ email }));
        if (user) {
            return res
                .status(409)
                .json({ message: "User with the email already exist" });
        }
        // Generate password hash
        const hash = yield (0, common_utils_1.fetchRetry)(5, common_utils_1.hashfunction, [password]);
        if (!hash) {
            return res
                .status(500)
                .json({ message: "Some error occured please try again" });
        }
        // Insert user to the DB
        const isUserAdded = yield addUser(db, name, email, hash, false, role, rest);
        if (isUserAdded) {
            const accessToken = (0, jwt_utils_1.signJWT)({ email, name, role }, "10m");
            const refreshToken = (0, jwt_utils_1.signJWT)({ email, name, role }, "1y");
            // Set access and refresh token in cookie
            res.cookie("accessToken", accessToken, {
                maxAge: 30000000,
                httpOnly: true,
                sameSite: "none",
                secure: true
            });
            res.cookie("refreshToken", refreshToken, {
                maxAge: 3.154e10,
                httpOnly: true,
                sameSite: "none",
                secure: true
            });
            res.cookie("role", role, {
                maxAge: 3.154e10,
                httpOnly: true,
                sameSite: "none",
                secure: true
            });
            return res.status(200).json({
                email,
                name,
                role,
                message: "User added succefully"
            });
        }
        res.status(500).json({ message: "Some error occured please try again" });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Some error occured please try again" });
    }
});
exports.signupHandler = signupHandler;
const loginHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const db = yield mongo_connect_utils_1.default.getDB();
    // Verify the user exist or not from DB
    try {
        const user = yield (db === null || db === void 0 ? void 0 : db.collection("users").findOne({ email }));
        console.log(password, user === null || user === void 0 ? void 0 : user.password.length);
        if (!user) {
            return res.status(404).json({
                message: "Email or password does not match with our records."
            });
        }
        // Compare the password
        const result = (0, common_utils_1.compareHash)(password.toString(), user.password);
        if (!result) {
            return res.status(404).json({
                message: "Email or password does not match with our records."
            });
        }
        else if (result === "error") {
            return res
                .status(500)
                .json({ message: "Some error occured please try again" });
        }
        const accessToken = (0, jwt_utils_1.signJWT)({ email, name: user === null || user === void 0 ? void 0 : user.name, role: user === null || user === void 0 ? void 0 : user.role }, "5m");
        const refreshToken = (0, jwt_utils_1.signJWT)({ email, name: user === null || user === void 0 ? void 0 : user.name, role: user === null || user === void 0 ? void 0 : user.role }, "1y");
        // Set access and refresh token in cookie
        res.cookie("accessToken", accessToken, {
            maxAge: 30000000,
            httpOnly: true,
            sameSite: "none",
            secure: true
        });
        res.cookie("refreshToken", refreshToken, {
            maxAge: 3.154e10,
            httpOnly: true,
            sameSite: "none",
            secure: true
        });
        res.cookie("role", user === null || user === void 0 ? void 0 : user.role, {
            maxAge: 3.154e10,
            httpOnly: true,
            sameSite: "none",
            secure: true
        });
        res.status(200).json({
            email,
            name: user.name,
            role: user === null || user === void 0 ? void 0 : user.role,
            message: "Logged in successfully"
        });
    }
    catch (err) {
        console.log(err);
    }
});
exports.loginHandler = loginHandler;
const logoutHandler = (req, res) => {
    // Set access and refresh token in cookie
    res.cookie("accessToken", "", {
        maxAge: 0,
        httpOnly: true,
        sameSite: "none",
        secure: true
    });
    res.cookie("refreshToken", "", {
        maxAge: 0,
        httpOnly: true,
        sameSite: "none",
        secure: true
    });
    res.cookie("role", "", {
        maxAge: 0,
        httpOnly: true,
        sameSite: "none",
        secure: true
    });
    return res.status(200).send({ message: "logged out successfully" });
};
exports.logoutHandler = logoutHandler;
const changePasswordHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    // @ts-ignore
    const email = (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.email;
    const db = yield mongo_connect_utils_1.default.getDB();
    const { oldPassword, newPassword } = req.body;
    console.log(email);
    try {
        const user = yield (db === null || db === void 0 ? void 0 : db.collection("users").findOne({ email }));
        // Compare the password
        // @ts-ignore
        const result = (0, common_utils_1.compareHash)(oldPassword.toString(), user.password);
        if (!result) {
            return res.status(404).json({
                message: "Your current password does not match with our records."
            });
        }
        else if (result === "error") {
            return res
                .status(500)
                .json({ message: "Some error occured please try again" });
        }
        const isPasswordChanged = yield (0, exports.setPassword)(email, newPassword);
        if (isPasswordChanged) {
            return res.status(200).json({ message: "Password changed successfully" });
        }
        return res.status(304).json({ message: "Unable to change password" });
    }
    catch (err) {
        res.status(500).json({ message: "Some error occured please try again" });
    }
});
exports.changePasswordHandler = changePasswordHandler;
const setPassword = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield mongo_connect_utils_1.default.getDB();
    // Generate password hash
    const hash = yield (0, common_utils_1.fetchRetry)(5, common_utils_1.hashfunction, [password]);
    if (!hash) {
        return false;
    }
    try {
        const result = yield db
            .collection("users")
            .updateOne({ email }, { $set: { password: hash } });
        return result;
    }
    catch (err) {
        return false;
    }
});
exports.setPassword = setPassword;
const forgotPasswordHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const db = yield mongo_connect_utils_1.default.getDB();
    const password = (0, common_utils_1.generateRandomNumber)(6);
    try {
        const result = yield (db === null || db === void 0 ? void 0 : db.collection("users").findOne({ email }));
        if (result) {
            const isPasswordChanged = yield (0, exports.setPassword)(email, password);
            if (isPasswordChanged) {
                (0, mail_utils_1.sendTemporaryPassword)(email, password);
                return res
                    .status(200)
                    .json({ message: "Temproary password is sent to your mail Id" });
            }
        }
        res.status(500).json({
            message: "Unable to generate new password please try again."
        });
    }
    catch (err) {
        res.status(500).json({ message: "Some error occured please try again" });
    }
});
exports.forgotPasswordHandler = forgotPasswordHandler;
const usersListHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield mongo_connect_utils_1.default.getDB();
    try {
        const users = yield (db === null || db === void 0 ? void 0 : db.collection("users").find({ role: "user" }).toArray());
        if (!users) {
            return res.status(404).json({ message: "0 Users found." });
        }
        res.status(200).json({ users, message: "success" });
    }
    catch (err) {
        return res.status(500).json({
            message: "Unable to get users, please try again later."
        });
    }
});
exports.usersListHandler = usersListHandler;
