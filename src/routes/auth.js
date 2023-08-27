const { Router } = require("express");
const { check } = require("express-validator");
const multer = require("multer");

const router = Router();

const {
  baseEmailValidator,
  basePasswordValidator,
  baseTextValidator,
} = require("../middlewares/validators/general_validators");

const isAuth = require("../middlewares/is_auth");

const checkEmailAlreadyExist = require("../middlewares/validators/check_email_exist_validator");
const checkEmailPasswordDoesNotMatch = require("../middlewares/validators/check_email_password_does_not_match_validator");

const signUpController = require("../controllers/auth/sign_up_controller.js");
const verifyEmailController = require("../controllers/auth/verify_email_controller.js");
const retrieveUserController = require("../controllers/auth/retrieve_user_controller");
const loginController = require("../controllers/auth/login_controller.js");
const onboardingController = require("../controllers/auth/onboarding_controller.js");
const uploadPhotoController = require("../controllers/auth/upload_photo_controller.js");

// Setting up multer as a middleware to grab photo uploads
const upload = multer({ storage: multer.memoryStorage() });

// SIGN UP
router.post(
  "/signup",
  [
    baseTextValidator("name"),
    basePasswordValidator(),
    baseEmailValidator().custom(checkEmailAlreadyExist),
  ],
  signUpController
);

// VERRIFY VERIFICATION CODE
router.post("/verify", [baseEmailValidator()], verifyEmailController);

// POST ONBOARDING DETAILS
router.post(
  "/onboarding",
  [baseTextValidator("programme")],
  onboardingController
);

// SUBMIT PROFILR PHOTO
router.put("/upload/photo", upload.single("photo"), uploadPhotoController);

// LOGIN
router.post(
  "/login",
  [baseEmailValidator("email").custom(checkEmailPasswordDoesNotMatch)],
  loginController
);

router.get("/retrieve", isAuth, retrieveUserController);

module.exports = router;
