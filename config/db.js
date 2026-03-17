import mongoose from "mongoose";

mongoose
  .connect(
    "mongodb+srv://himanshusingh1k_db_user:CC3WT9zw1vGci3dS@cluster0.o6mfgxl.mongodb.net/crewing-auth",
  )
  .then(() => console.log("DataBase Connected"))
  .catch(() => console.log("Not able to connect to MongoDB"));
