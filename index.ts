const csv = require("csv-parser");
const fs = require("fs");

fs.createReadStream("data.csv")
  .pipe(csv())
  .on("data", (row: any) => {
    console.log(row);
  })
  .on("end", () => {
    console.log("CSV file successfully processed");
  });
