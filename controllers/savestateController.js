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

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/gci");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname.slice(0, -4) + "-" + Date.now() + ".gci");
  },
});

const multerFilter = (req, file, callback) => {
  if (file.mimetype.startsWith("application/octet-stream")) {
    callback(null, true);
  } else {
    callback(new AppError("Please upload gci file formats", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadGCIFile = upload.single("file");

exports.getAllSavestates = factory.getAll(Savestate);
exports.getSavestate = factory.getOne(Savestate);
exports.updateSavestate = factory.updateOne(Savestate);

exports.deleteSavestate = factory.deleteOne(Savestate);

exports.createSavestate = catchAsync(async (req, res) => {
  const newSavestate = await Savestate.create({
    character: req.body.character,
    characterAgainst: req.body.characterAgainst,
    stage: req.body.stage,
    user: req.body.user,
    title: req.body.title,
    file: req.file.filename,
  });
  res.status(201).json({
    status: "success",
    data: { data: newSavestate },
  });
});
exports.getSavestatesByUser = catchAsync(async (req, res, next) => {
  const savestates = await Savestate.find({ user: { _id: req.params.id } });
  res.status(200).json({
    status: "success",
    results: savestates.length,
    savestates,
  });
});
exports.getCharacterSavestates = catchAsync(async (req, res, next) => {
  const characters = Savestate.schema.path("character").enumValues;
  if (!characters.includes(req.params.character)) {
    return next(new AppError("Character name invalid"), 400);
  }

  const features = new APIFeatures(
    Savestate.find({ character: req.params.character }),
    req.query
  )
    .paginate()
    .sort();

  const savestates = await features.query;

  res.status(200).json({
    status: "success",
    results: savestates.length,
    savestates,
  });
});
