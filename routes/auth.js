// External Modules :-
import express from "express";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

// Local Modules :-
import Crew from "../models/crew.js";
import isLoggedIn from "../middleware/isLoggedIn.js";
import customResponse from "../utils/customResponse.js";

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  const { crewName, email, password } = req.body;
  console.log("/signup Run");
  const saltRounds = 10;

  if (!crewName || !email || !password) {
    return customResponse(res, 400, false, "All fields are required");
  }

  try {
    const foundCrew = await Crew.findOne({ email });

    if (foundCrew) {
      return customResponse(res, 400, false, "", "Crew already Exists");
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    let newCrew = new Crew({ crewName, email, password: hashedPassword });

    newCrew.token = uuid();
    console.log
    const savedCrew = await newCrew.save();

    if (savedCrew) {
      return customResponse( res, 200, true, "Crew Saved Successfully", "", savedCrew );
    } // prettier-ignore
  } catch (err) {
    return customResponse(res, 500, false, "", "Internal Server Error", null);
  }
});

// { Login Route } :-
authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // validations:
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
    } // prettier-ignore

    // generate token:
    let token = uuid();

    // save token
    foundCrew.token = token;

    let tokenedCrew = await foundCrew.save();

    return customResponse(res, 200, true, "Crew LoggedIN", "", tokenedCrew);
  } catch (err) {
    return customResponse(res, 500, false, "", "Internal Server Error", null);
  }
});

authRouter.get("/zuku/", isLoggedIn, async (req, res) => {
  let randomJoke = zuckerbergJokes[parseInt(Math.random() * 10)];
  return customResponse(res, 200, true, "Joke is Ready", "", {
    joke: randomJoke,
    Crew: req.currentCrew,
  });
});

// { Logout Route } :-
authRouter.delete("/logout", isLoggedIn, async (req, res) => {
  try {
    let foundCrew = req.currentCrew;
    foundCrew.token = "";
    // delete foundCrew.token
    // Crew.findOneAndDelete({ token });
    console.log(foundCrew);

    let loggedOutCrew = await foundCrew.save();

    return customResponse(res, 200, true, " Crew LoggedOut", "", loggedOutCrew);
  } catch (err) {
    return customResponse(res, 500, false, "", "Internal Server Error", null);
  }
});

export default authRouter;
