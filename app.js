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

// I am creating a website in which a shipping company like evergreen and crew can registered and create there profiles . I am done with the landing, login & signup page. And this is the backend app which handles auth routes only and save it in mongodb & create a .env file in which i'll store the data. I am creating this website just for showcasing a company my skill so that i can prove that i know the skill I have used the vite+react in frontend . I want you to create a express backend app with mongodb . And create a .env in which i'll configure the db. I am taking fullName, email, password, & confirmPassword for  crew & companyName for company with rest of fields.
