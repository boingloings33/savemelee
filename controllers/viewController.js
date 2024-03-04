const axios = require("axios");

const catchAsync = require("../utils/catchAsync");
const Savestate = require("../models/savestateModel");
const User = require("../models/userModel");
const characters = Savestate.schema.path("character").enumValues;
const charactersAlphabetized = [...characters].sort();
const stages = Savestate.schema.path("stage").enumValues.sort();
console.log(stages);

exports.getHome = catchAsync(async (req, res, next) => {
  res.status(200).render("home", {
    title: "Home",
    characters,
  });
});

exports.getCharacterPage = async (req, res, next) => {
  try {
    const page = req.params.page;
    const result = await axios({
      method: "GET",
      url: `${req.protocol}://${req.get("host")}/api/v1/savestates/character/${req.params.character}?page=${page}&limit=20`,
    });
    const characterSavestate = result.data.savestates;

    const unfilteredResult = await axios({
      method: "GET",
      url: `${req.protocol}://${req.get("host")}/api/v1/savestates/character/${req.params.character}`,
    });
    const savestateAmount = unfilteredResult.data.savestates.length;

    res.status(200).render("character", {
      title: req.params.character,
      characterSavestate,
      savestateAmount,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getLogin = catchAsync(async (req, res, next) => {
  res.status(200).render("login", {
    title: "Login",
  });
});

exports.getSignup = catchAsync(async (req, res, next) => {
  res.status(200).render("signup", {
    title: "Sign Up",
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  res.status(200).render("me", {
    title: "Profile",
  });
});

exports.getUploadSavestate = catchAsync(async (req, res, next) => {
  res.status(200).render("uploadSavestate", {
    title: "Upload Savestate",
    charactersAlphabetized,
    stages,
  });
});
