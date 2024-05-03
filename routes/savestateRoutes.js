const express = require("express");
const router = express.Router();
const reviewRouter = require("./reviewRoutes");
const {
  getAllSavestates,
  createSavestate,
  getSavestate,
  updateSavestate,
  deleteSavestate,
  getCharacterSavestates,
  uploadGCIFile,
  getSavestatesByUser,
} = require("../controllers/savestateController");
const { protect, restrictTo } = require("../controllers/authController");

router.use("/:savestateId/reviews", reviewRouter);

router
  .route("/")
  .get(restrictTo("admin"), getAllSavestates)
  .post(protect, uploadGCIFile, createSavestate);

router
  .route("/:id")
  .get(getSavestate)
  .patch(protect, updateSavestate)
  .delete(protect, deleteSavestate);
router.route("/character/:character").get(getCharacterSavestates);
router.route("/user/:id").get(protect, getSavestatesByUser);

module.exports = router;
