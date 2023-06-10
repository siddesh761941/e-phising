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
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const mongo_connect_utils_1 = __importDefault(require("./utils/mongo-connect.utils"));
const common_utils_1 = require("./utils/common.utils");
const deserializeuser_1 = __importDefault(require("./middlewares/deserializeuser"));
const app = (0, express_1.default)();
const PORT = 8000;
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(deserializeuser_1.default);
// app.use(
//   cors({
//     credentials: true,
//     origin: ["https://e-phsing.firebaseapp.com/", "https://e-phsing.web.app/"]
//   })
// );
const corsOpts = {
    origin: "*"
};
app.use((0, cors_1.default)(corsOpts));
const mongoConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield (0, common_utils_1.fetchRetry)(5, mongo_connect_utils_1.default.connectToDB);
    if (db) {
        (0, routes_1.default)(app);
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
});
mongoConnection();
