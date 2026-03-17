import mongoose from "mongoose";

mongoose
  .connect(process.env.MONGO_DB_STRING)
  .then(() => console.log("DataBase Connected"))
  .catch(() => console.log("Not able to connect to MongoDB"));
