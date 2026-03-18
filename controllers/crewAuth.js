// External Modules :-
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

// Local Modules :-
import Crew from "../models/crew.js";
import customResponse from "../utils/customResponse.js";

export const crewSignup = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  const saltRounds = 10;

  if (!name || !email || !password || !confirmPassword) {
    return customResponse(res, 400, false, "All fields are required");
  }

  if (password !== confirmPassword) {
    return customResponse(res, 400, false, "Passwords do not match");
  }

  try {
    const foundCrew = await Crew.findOne({ email });

    if (foundCrew) {
      return customResponse(res, 400, false, "", "Crew already Exists");
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    let newCrew = new Crew({ name, email, password: hashedPassword });

    newCrew.token = uuid();
    const savedCrew = await newCrew.save();

    // Remove password and token before sending to client
    const crewData = savedCrew.toObject();
    delete crewData.password;

    return customResponse(res, 200, true, "Crew Saved Successfully", "", crewData); // prettier-ignore
  } catch (err) {
    console.error(err);
    return customResponse(res, 500, false, "", "Internal Server Error", null);
  }
};

export const crewLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return customResponse(res, 400, false, "All fields are required");
  }

  try {
    const foundCrew = await Crew.findOne({ email });

    if (!foundCrew) {
      return customResponse(res, 400, false, "", "Crew doesn't exist", null);
    }

    const isMatch = await bcrypt.compare(password, foundCrew.password);

    if (!isMatch) {
      return customResponse(res, 400, false, "", "Incorrect Password", null);
    }

    let token = uuid();
    foundCrew.token = token;
    let tokenedCrew = await foundCrew.save();

    const crewData = tokenedCrew.toObject();
    delete crewData.password;

    return customResponse(res, 200, true, "Crew Logged In", "", crewData);
  } catch (err) {
    return customResponse(res, 500, false, "", "Internal Server Error", null);
  }
};

export const crewLogout = async (req, res) => {
  try {
    if (!req.currentCrew) {
      return customResponse(
        res,
        400,
        false,
        "",
        "No Crew session found.",
        null,
      );
    }

    let foundCrew = req.currentCrew;
    foundCrew.token = "";

    await foundCrew.save();

    return customResponse(res, 200, true, "Crew LoggedOut", "", null);
  } catch (err) {
    return customResponse(res, 500, false, "", "Internal Server Error", null);
  }
};
