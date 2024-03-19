const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");

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

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_IAM_ACCESS_KEY,
    secretAccessKey: process.env.AWS_IAM_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_IAM_REGION,
});
const s3Storage = multerS3({
  s3: s3,
  bucket: process.env.AWS_S3_BUCKET_NAME,

  metadata: (req, file, cb) => {
    cb(null, { fieldname: file.fieldname });
  },
  key: (req, file, cb) => {
    cb(null, file.originalname.slice(0, -4) + "-" + Date.now() + ".gci");
  },
});

const upload = multer({
  storage: s3Storage,
});
exports.uploadGCIFile = upload.single("file");

exports.getAllSavestates = factory.getAll(Savestate);
exports.getSavestate = factory.getOne(Savestate);
exports.updateSavestate = factory.updateOne(Savestate);
exports.deleteSavestate = factory.deleteOne(Savestate);

exports.createSavestate = catchAsync(async (req, res, next) => {
  console.log(req.file);
  const newSavestate = await Savestate.create({
    character: req.body.character,
    characterAgainst: req.body.characterAgainst,
    user: req.body.user,
    title: req.body.title,
    file: req.file.key,
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
