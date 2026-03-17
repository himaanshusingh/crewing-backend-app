import "dotenv/config";
import express from "express";
import cors from "cors";

// Local modules :-
import "./config/db.js"; // DB
import authRouter from "./routes/auth.js"; // router

const app = express();

app.use(cors());
app.use(express.json());

app.use(authRouter);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
