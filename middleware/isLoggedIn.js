import customResponse from "../utils/customResponse.js";
import Crew from "../models/crew.js";
import Company from "../models/company.js";

async function isLoggedIn(req, res, next) {
  let token = req.headers.authorization;
  if (!token) {
    return customResponse(res, 400, false, "", "Token Missing", null);
  }

  token = token.split(" ")[1]; // undefined

  if (!token) {
    return customResponse(res, 400, false, "", "Token Missing", null);
  }

  try {
    const foundCrew = await Crew.findOne({ token: token });

    if (foundCrew) {
       req.currentCrew = foundCrew;
       return next();
    }

    const foundCompany = await Company.findOne({ token: token });

    if (foundCompany) {
       req.currentCompany = foundCompany;
       return next();
    }

    return customResponse(res, 401, false, "", "Unauthorized: Invalid or expired token", null);
  } catch (err) {
    return customResponse(res, 500, false, "", "Internal Server Error", null);
  }
}

export default isLoggedIn;
