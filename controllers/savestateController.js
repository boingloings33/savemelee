const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");

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
exports.createSavestate = catchAsync(async (req, res, next) => {
  const newSavestate = await Savestate.create({
    character: req.body.character,
    characterAgainst: req.body.characterAgainst,
    user: req.body.user,
    title: req.body.title,
    description: req.body.description,
    file: req.file.key,
  });
  res.status(201).json({
    status: "success",
    data: { data: newSavestate },
  });
});
exports.getAllSavestates = factory.getAll(Savestate);
exports.updateSavestate = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const doc = await Savestate.findByIdAndUpdate(
    req.params.savestateId,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!doc) {
    return next(new AppError("No document found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    results: doc.length,
    data: { data: doc },
  });
});
exports.getSavestate = catchAsync(async (req, res, next) => {
  let query = Savestate.findById(req.params.savestateId);
  const savestate = await query;

  console.log(savestate);

  if (!savestate) {
    return next(new AppError("No savestate found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    results: savestate.length,
    savestate,
  });
});
exports.deleteSavestate = catchAsync(async (req, res, next) => {
  const savestate = await Savestate.findByIdAndDelete(req.params.savestateId);
  const bucketInput = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: savestate.file,
  };
  const bucketCommand = new DeleteObjectCommand(bucketInput);
  await s3.send(bucketCommand);

  if (!savestate) {
    return next(new AppError("No savestate found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
exports.deleteAllSavestatesByUser = catchAsync(async (req, res, next) => {
  const savestates = await Savestate.find({ user: { _id: req.params.id } });
  savestates.forEach((savestate) => {
    const bucketInput = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: savestate.file,
    };
    const bucketCommand = new DeleteObjectCommand(bucketInput);
    s3.send(bucketCommand);
  });
  const deleteSavestates = await Savestate.deleteMany({
    user: { _id: req.params.id },
  });

  if (!deleteSavestates) {
    return next(new AppError("No savestates found with that ID", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
  next();
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
