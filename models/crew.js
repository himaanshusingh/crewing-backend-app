import { model, Schema } from "mongoose";

const crewSchema = new Schema({
  name: {
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
