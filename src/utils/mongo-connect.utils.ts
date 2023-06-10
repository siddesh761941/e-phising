import mongoDB, { MongoClient } from "mongodb";

require("dotenv").config();

// Connection URI
const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PWD}@cluster0.7mx8ide.mongodb.net/?retryWrites=true&w=majority`;

let _db: mongoDB.Db;
const dbOptions = {
  keepAlive: true,
  wtimeoutMS: 2500000,
  connectTimeoutMS: 10000,
  useNewUrlParser: true,
  useUnifiedTopology: true
};

console.log(uri);
// Create a new MongoClient
const client: mongoDB.MongoClient = new MongoClient(uri, dbOptions);

export default {
  connectToDB: async () => {
    try {
      const connection = await client.connect();
      if (connection) {
        console.log("Successfully connected to DB");
        _db = client.db("ephising");
        return _db;
      }
    } catch (err) {
      console.log("DB connection failed", err);
      return false;
    }
  },

  getDB: () => _db
};
