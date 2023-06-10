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
exports.sendTemporaryPassword = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transport = nodemailer_1.default.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "securefromphising@gmail.com",
        pass: "xvgvrgmclwsbnszr" //"hbysvumgqwbdxbqd"
    }
});
const sendTemporaryPassword = (email, pwd) => __awaiter(void 0, void 0, void 0, function* () {
    const mailOptions = {
        from: "securefromphising@gmail.com",
        subject: "Temproary Password",
        text: `Your temproary password is ${pwd}`,
        to: email
    };
    try {
        yield transport.sendMail(mailOptions);
    }
    catch (err) {
        console.log(err);
    }
});
exports.sendTemporaryPassword = sendTemporaryPassword;
