// External Modules :-
import express from "express";

// Local Modules :-
import isLoggedIn from "../middleware/isLoggedIn.js";
import { crewLogin, crewLogout, crewSignup } from "../controllers/crewAuth.js";
import { compLogin, compLogout, compSignup } from "../controllers/compAuth.js";

const authRouter = express.Router();

// { CREW ROUTES } :-
authRouter.post("/crew/signup", crewSignup);
authRouter.post("/crew/login", crewLogin);
authRouter.delete("/crew/logout", isLoggedIn, crewLogout);

// { COMPANY ROUTES } :-
authRouter.post("/company/signup", compSignup);
authRouter.post("/company/login", compLogin);
authRouter.delete("/company/logout", isLoggedIn, compLogout);

export default authRouter;
