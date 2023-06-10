import express from "express";
import routes from "./routes";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";

import mongoUtil from "./utils/mongo-connect.utils";
import { fetchRetry } from "./utils/common.utils";
import deserializeUser from "./middlewares/deserializeuser";

const app = express();
const PORT = 8000;

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(deserializeUser);

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5500", "http://127.0.0.1:5500", "*"]
  })
);

const mongoConnection = async () => {
  const db = await fetchRetry(5, mongoUtil.connectToDB);
  if (db) {
    routes(app);
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
};

mongoConnection();
