const mongoose = require("mongoose");
const dbConnect = (dbName) => {
  const dbConnection = mongoose
    .createConnection(
      `${process.env.MONGODB_URI}/${dbName}?retryWrites=true&w=majority`
    )
    .on("error", (error) => {
      console.log(`${dbName} database failed to connect.`);
      console.log(error);
    })
    .on("connected", () => {
      console.log(`${dbName} database connected.`);
    })
    .on("disconnected", () => {
      console.log(`${dbName} database disconnected.`);
    });

  return dbConnection;
};

// Database connection
const db = dbConnect(process.env.DB_NAME);

module.exports = { db };
