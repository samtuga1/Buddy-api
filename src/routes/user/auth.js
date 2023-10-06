const { Router } = require("express");
const multer = require("multer");

const router = Router();

const {
  baseEmailValidator,
  basePasswordValidator,
  baseTextValidator,
} = require("../../middlewares/validators/general_validators");

const isAuth = require("../../middlewares/is_auth");

const checkEmailAlreadyExist = require("../../middlewares/validators/check_email_exist_validator");
const checkEmailPasswordDoesNotMatch = require("../../middlewares/validators/check_email_password_does_not_match_validator");

const signUpController = require("../../controllers/user/auth/sign_up_controller");
const verifyEmailController = require("../../controllers/user/auth/verify_email_controller.js");
const retrieveUserController = require("../../controllers/user/auth/retrieve_user_controller");
const loginController = require("../../controllers/user/auth/login_controller.js");
const requestPasswordResetController = require("../../controllers/user/auth/request_reset_password");
const resetPasswordController = require("../../controllers/user/auth/reset_password_controller");
const onboardingController = require("../../controllers/user/auth/onboarding_controller.js");
const uploadPhotoController = require("../../controllers/user/auth/upload_photo_controller.js");

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
router.post("/verify", verifyEmailController);

// POST ONBOARDING DETAILS
router.post(
  "/onboarding",
  [baseTextValidator("college")],
  onboardingController
);

// SUBMIT PROFILE PHOTO
router.put("/upload/photo", upload.single("photo"), uploadPhotoController);

// LOGIN
router.post(
  "/login",
  [baseEmailValidator().custom(checkEmailPasswordDoesNotMatch)],
  loginController
);

router.get("/retrieve", isAuth, retrieveUserController);

router.post(
  "/request/password/reset",
  [baseEmailValidator()],
  requestPasswordResetController
);

router.post("/reset/password", [baseEmailValidator()], resetPasswordController);

module.exports = router;
