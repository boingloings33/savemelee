const express = require("express");

const router = express.Router();

const { isLoggedIn, protect } = require("../controllers/authController");
const {
  getHome,
  getCharacterPage,
  getLogin,
  getSignup,
  getMe,
  getUploadSavestate,
} = require("../controllers/viewController");

router.get("/", isLoggedIn, getHome);
router.get("/character/:character/:page", isLoggedIn, getCharacterPage);
router.get("/login", getLogin);
router.get("/signup", getSignup);
router.get("/me", protect, isLoggedIn, getMe);
router.get("/upload-savestate", protect, isLoggedIn, getUploadSavestate);
module.exports = router;
