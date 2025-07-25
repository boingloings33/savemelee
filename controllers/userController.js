const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError("This route is not for password updates. Please use /updateMyPassword"), 400);
  }

  // 2) Filter out unwanted field names

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.user.id);
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.createUser = function (req, res) {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined! Please use /signup instead.",
  });
};
exports.deleteUser = function (req, res) {
  factory.deleteOne(User);
};
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.getAllUsers = factory.getAll(User);
