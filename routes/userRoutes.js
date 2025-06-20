const express = require("express");
const {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
  restrictTo,
} = require("../controllers/authController");

const { getUser, updateMe, deleteMe, getMe, getAllUsers, updateUser } = require("../controllers/userController");

const { deleteAllSavestatesByUser } = require("../controllers/savestateController");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

router.use(protect);
router.patch("/updateMyPassword", updatePassword);
router.get("/me", getMe, getUser);
router.patch("/updateMe", updateMe);
router.delete("/deleteMe/:id", deleteAllSavestatesByUser, deleteMe);

router.use(restrictTo("admin"));
router.route("/").get(getAllUsers);
router.route("/:id").patch(updateUser);

module.exports = router;
