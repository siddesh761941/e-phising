import express from "express";
import csv from "csv-parser";
import fs from "fs";

import mongoUtil from "./src/utils/mongo-connect.utils";
import { fetchRetry } from "./src/utils/common.utils";

require("dotenv").config();

const app = express();
const PORT = 9000;

const mongoConnection = async () => {
  const db = await fetchRetry(5, mongoUtil.connectToDB);
  if (db) {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
  dataMiningCSV();
};

mongoConnection();

async function dataMiningCSV() {
  const db = await mongoUtil.getDB();
  fs.createReadStream("./src/data/data.csv")
    .pipe(csv())
    .on("data", async (row: any) => {
      const link = row?.link;
      const description = row?.description || "";
      const isSecured = row?.isSecured === "TRUE" ? true : false;

      if (link.length < 45) {
        db?.collection("links").insertOne({ link, description, isSecured });
      }
    })
    .on("end", () => {
      console.log("CSV file successfully processed");
    });
}
