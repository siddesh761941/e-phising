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
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
require("dotenv").config();
// Connection URI
const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PWD}@cluster0.7mx8ide.mongodb.net/?retryWrites=true&w=majority`;
let _db;
const dbOptions = {
    keepAlive: true,
    wtimeoutMS: 2500000,
    connectTimeoutMS: 10000,
    useNewUrlParser: true,
    useUnifiedTopology: true
};
console.log(uri);
// Create a new MongoClient
const client = new mongodb_1.MongoClient(uri, dbOptions);
exports.default = {
    connectToDB: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const connection = yield client.connect();
            if (connection) {
                console.log("Successfully connected to DB");
                _db = client.db("ephising");
                return _db;
            }
        }
        catch (err) {
            console.log("DB connection failed", err);
            return false;
        }
    }),
    getDB: () => _db
};
