import express from "express";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

// Local Modules :-
import Crew from "../models/crew.js";
import Company from "../models/company.js";
import isLoggedIn from "../middleware/isLoggedIn.js";
import customResponse from "../utils/customResponse.js";

const authRouter = express.Router();

// ==========================================
// CREW ROUTES
// ==========================================

authRouter.post("/crew/signup", async (req, res) => {
  const { fullName, email, password, confirmPassword } = req.body;
  const saltRounds = 10;

  if (!fullName || !email || !password || !confirmPassword) {
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

    let newCrew = new Crew({ fullName, email, password: hashedPassword });

    newCrew.token = uuid();
    const savedCrew = await newCrew.save();

    // Remove password and token before sending to client
    const crewData = savedCrew.toObject();
    delete crewData.password;

    return customResponse( res, 200, true, "Crew Saved Successfully", "", crewData );

  } catch (err) {
    console.error(err);
    return customResponse(res, 500, false, "", "Internal Server Error", null);
  }
});

authRouter.post("/crew/login", async (req, res) => {
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
});

authRouter.delete("/crew/logout", isLoggedIn, async (req, res) => {
  try {
    if (!req.currentCrew) {
        return customResponse(res, 400, false, "", "No Crew session found.", null);
    }

    let foundCrew = req.currentCrew;
    foundCrew.token = "";

    await foundCrew.save();

    return customResponse(res, 200, true, "Crew LoggedOut", "", null);
  } catch (err) {
    return customResponse(res, 500, false, "", "Internal Server Error", null);
  }
});

// ==========================================
// COMPANY ROUTES
// ==========================================

authRouter.post("/company/signup", async (req, res) => {
  const { companyName, email, password, confirmPassword } = req.body;
  const saltRounds = 10;

  if (!companyName || !email || !password || !confirmPassword) {
    return customResponse(res, 400, false, "All fields are required");
  }

  if (password !== confirmPassword) {
     return customResponse(res, 400, false, "Passwords do not match");
  }

  try {
    const foundCompany = await Company.findOne({ email });

    if (foundCompany) {
      return customResponse(res, 400, false, "", "Company already Exists");
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    let newCompany = new Company({ companyName, email, password: hashedPassword });

    newCompany.token = uuid();
    const savedCompany = await newCompany.save();

    const companyData = savedCompany.toObject();
    delete companyData.password;

    return customResponse( res, 200, true, "Company Saved Successfully", "", companyData );

  } catch (err) {
    console.error(err);
    return customResponse(res, 500, false, "", "Internal Server Error", null);
  }
});

authRouter.post("/company/login", async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return customResponse(res, 400, false, "All fields are required");
    }
  
    try {
      const foundCompany = await Company.findOne({ email });
  
      if (!foundCompany) {
        return customResponse(res, 400, false, "", "Company doesn't exist", null);
      }
  
      const isMatch = await bcrypt.compare(password, foundCompany.password);
  
      if (!isMatch) {
        return customResponse(res, 400, false, "", "Incorrect Password", null);
      } 
  
      let token = uuid();
      foundCompany.token = token;
      let tokenedCompany = await foundCompany.save();
  
      const companyData = tokenedCompany.toObject();
      delete companyData.password;
  
      return customResponse(res, 200, true, "Company Logged In", "", companyData);
    } catch (err) {
      return customResponse(res, 500, false, "", "Internal Server Error", null);
    }
});

authRouter.delete("/company/logout", isLoggedIn, async (req, res) => {
    try {
      if (!req.currentCompany) {
          return customResponse(res, 400, false, "", "No Company session found.", null);
      }
  
      let foundCompany = req.currentCompany;
      foundCompany.token = "";
  
      await foundCompany.save();
  
      return customResponse(res, 200, true, "Company LoggedOut", "", null);
    } catch (err) {
      return customResponse(res, 500, false, "", "Internal Server Error", null);
    }
});

export default authRouter;
