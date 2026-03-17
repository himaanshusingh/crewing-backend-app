import { model, Schema } from "mongoose";

const crewSchema = new Schema({
  fullName: {
    type: String,
    required: [true, "Please provide your name"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  token: {
    type: String,
  },
});

const Crew = model("Crew", crewSchema);

export default Crew;

// I am creating a website in which a shipping company like evergreen and crew can registered and create there profiles . I am done with the landing, login & signup page. And this is the backend app which handles auth routes only and save it in mongodb & create a .env file in which i'll store the data. I am creating this website just for showcasing a company my skill so that i can prove that i know the skill I have used the vite+react in frontend . I want you to create a express backend app with mongodb . And create a .env in which i'll configure the db. I am taking fullName, email, password, & confirmPassword for  crew & companyName for company with rest of fields.
