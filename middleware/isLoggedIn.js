import customResponse from "../utils/customResponse.js";
import Crew from "../models/crew.js";

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

    if (!foundCrew) {
      return customResponse(res, 400, false, "", "Daffa ho ja", null);
    }

    req.currentCrew = foundCrew;

    next();
  } catch (err) {
    return customResponse(res, 500, false, "", "Internal Server Error", null);
  }
}

export default isLoggedIn;
