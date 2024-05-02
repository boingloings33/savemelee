const mongoose = require("mongoose");
const validateFile = require("../utils/validateFile");
const savestateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title"],
    maxlength: [30, "Title can't be more than 30 characters"],
  },
  description: {
    type: String,
    maxlength: [60, "Description can't be more than 120 characters"],
  },
  character: {
    type: String,
    enum: [
      "dr-mario",
      "mario",
      "luigi",
      "bowser",
      "peach",
      "yoshi",
      "donkey-kong",
      "falcon",
      "ganondorf",
      "falco",
      "fox",
      "ness",
      "ice-climbers",
      "kirby",
      "samus",
      "sheik",
      "zelda",
      "link",
      "young-link",
      "filler",
      "pichu",
      "pikachu",
      "jigglypuff",
      "mewtwo",
      "g&w",
      "marth",
      "roy",
    ],
    required: [true, "Please provide a character"],
  },
  characterAgainst: {
    type: String,
    enum: [
      "dr-mario",
      "mario",
      "luigi",
      "bowser",
      "peach",
      "yoshi",
      "donkey-kong",
      "falcon",
      "ganondorf",
      "falco",
      "fox",
      "ness",
      "ice-climbers",
      "kirby",
      "samus",
      "sheik",
      "zelda",
      "link",
      "young-link",
      "pichu",
      "pikachu",
      "jigglypuff",
      "mewtwo",
      "g&w",
      "marth",
      "roy",
    ],
    required: [true, "Please provide a character against"],
  },
  file: {
    type: String,
    required: [true, "Please provide a .gci file"],
    validate: {
      validator: function (value) {
        if (!value.endsWith(".gci")) {
          return false;
        }
        if (validateFile(value) === false) {
          return false;
        }
      },
      message: (props) =>
        `File includes invalid characters (such as % \ :/ * ? " < > |) or doesn't end in .gci`,
    },
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Savestate must belong to a user!"],
  },
});

savestateSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "username",
  });
  next();
});

savestateSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "savestate",
  localField: "_id",
});

savestateSchema.post(/^find/, function (docs, next) {
  next();
});

const Savestate = mongoose.model("Savestate", savestateSchema);
module.exports = Savestate;
