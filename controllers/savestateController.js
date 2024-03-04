const multer = require("multer");
const APIFeatures = require("../utils/apiFeatures");
const Savestate = require("../models/savestateModel");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
exports.aliasTopSavestates = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "price,-ratingsAverage";
  next();
};
exports.getAllSavestates = factory.getAll(Savestate);
exports.getSavestate = factory.getOne(Savestate, {
  path: "reviews",
});
exports.updateSavestate = factory.updateOne(Savestate);
exports.createSavestate = factory.createOne(Savestate);
exports.deleteSavestate = factory.deleteOne(Savestate);

exports.getCharacterSavestates = catchAsync(async (req, res, next) => {
  const characters = Savestate.schema.path("character").enumValues;
  if (!characters.includes(req.params.character)) {
    return next(new AppError("Character name invalid"), 400);
  }

  const features = new APIFeatures(
    Savestate.find({ character: req.params.character }),
    req.query
  ).paginate();

  const savestates = await features.query;

  res.status(200).json({
    status: "success",
    results: savestates.length,
    savestates,
  });
});
