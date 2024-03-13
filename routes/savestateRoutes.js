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
  .get(getAllSavestates)
  .post(protect, uploadGCIFile, createSavestate);
router
  .route("/:id")
  .get(getSavestate)
  .patch(protect, updateSavestate)
  .delete(protect, deleteSavestate);
router.route("/user/:id").get(getSavestatesByUser);
router.route("/character/:character").get(getCharacterSavestates);
module.exports = router;
