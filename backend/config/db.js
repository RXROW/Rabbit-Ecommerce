const mongoose = require("mongoose");
require("dotenv").config();

const url = process.env.MONGO_URL;

const dbConnection = () => {
  mongoose.connect(url).then((conn) => {
    console.log("connected to database");
  });
};

module.exports = dbConnection;
