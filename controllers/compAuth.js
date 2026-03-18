// External Modules :-
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

// Local Modules :-
import Company from "../models/company.js";
import customResponse from "../utils/customResponse.js";

export const compSignup = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  const saltRounds = 10;

  if (!name || !email || !password || !confirmPassword) {
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

    let newCompany = new Company({ name, email, password: hashedPassword });

    newCompany.token = uuid();
    const savedCompany = await newCompany.save();

    const companyData = savedCompany.toObject();
    delete companyData.password;

    return customResponse(
      res,
      200,
      true,
      "Company Saved Successfully",
      "",
      companyData,
    );
  } catch (err) {
    console.error(err);
    return customResponse(res, 500, false, "", "Internal Server Error", null);
  }
};

export const compLogin = async (req, res) => {
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
};

export const compLogout = async (req, res) => {
  try {
    if (!req.currentCompany) {
      return customResponse(
        res,
        400,
        false,
        "",
        "No Company session found.",
        null,
      );
    }

    let foundCompany = req.currentCompany;
    foundCompany.token = "";

    await foundCompany.save();

    return customResponse(res, 200, true, "Company LoggedOut", "", null);
  } catch (err) {
    return customResponse(res, 500, false, "", "Internal Server Error", null);
  }
};
