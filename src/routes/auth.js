import { Router } from "express";

import signUpController from "../controllers/auth/sign_up";

const router = Router();

router.post("/signup", signUpController);
