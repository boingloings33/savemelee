const axios = require("axios");

const catchAsync = require("../utils/catchAsync");
const Savestate = require("../models/savestateModel");
const characters = Savestate.schema.path("character").enumValues;
const charactersAlphabetized = [...characters].sort().filter((string) => string !== "filler");
// const stages = Savestate.schema.path("stage").enumValues.sort();

exports.getHome = catchAsync(async (req, res, next) => {
  try {
    res.status(200).render("home", {
      title: "Home",
      characters,
    });
  } catch (err) {
    console.error("API Error:", err.response?.data || err.message || err);
    res.status(500).render("error", { message: "Failed to load home page" });
  }
});
exports.getCharacterPage = async (req, res, next) => {
  try {
    let page = parseInt(req.params.page);
    if (Number.isNaN(page)) page = 1;
    const { characterAgainst, uploadedBy } = req.query;

    // Build query string
    let query = `page=${page}&limit=20`;
    if (characterAgainst) query += `&characterAgainst=${characterAgainst}`;
    if (uploadedBy) query += `&uploadedBy=${uploadedBy}`;

    // Get filtered savestates
    const result = await axios.get(
      `${req.protocol}://${req.get("host")}/api/v1/savestates/character/${req.params.character}?${query}`
    );
    const characterSavestate = result.data.savestates;

    // Get unfiltered list to build dropdowns
    const unfilteredResult = await axios.get(
      `${req.protocol}://${req.get("host")}/api/v1/savestates/character/${req.params.character}`
    );
    const allSavestates = unfilteredResult.data.savestates;

    // Safely extract filter options
    const allCharacters = [...new Set(allSavestates.map((s) => s.characterAgainst))];
    const allUploaders = [...new Set(allSavestates.map((s) => s.user?.username).filter(Boolean))];
    const isFiltered = !!(characterAgainst || uploadedBy);

    // Render page with data
    res.status(200).render("character", {
      title: req.params.character,
      character: req.params.character,
      characterSavestate,
      allCharacters,
      allUploaders,
      characterAgainst,
      uploadedBy,
      isFiltered,
    });
  } catch (err) {
    console.error(err);
    res.status(500).render("error", { message: "Failed to load character page" });
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

exports.getDeleteAccount = catchAsync(async (req, res, next) => {
  res.status(200).render("deleteAccount", {
    title: "Delete Account",
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
  });
});

exports.getSavestate = catchAsync(async (req, res, next) => {
  const result = await axios({
    method: "GET",
    url: `${req.protocol}://${req.get("host")}/api/v1/savestates/${req.params.savestateId}`,
  });

  const userSavestate = result.data.savestate;

  res.status(200).render("shareSavestate", {
    title: "Share Savestate",
    userSavestate,
  });
});
exports.getSavestatesByUser = catchAsync(async (req, res, next) => {
  const result = await axios({
    method: "GET",
    url: `${req.protocol}://${req.get("host")}/api/v1/savestates/user/${req.params.id}`,
  });

  const userSavestates = result.data.savestates;

  res.status(200).render("getSavestatesByUser", {
    title: "Your Savestates",
    userSavestates,
    charactersAlphabetized,
  });
});
