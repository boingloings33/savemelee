const mongoose = require("mongoose");
const savestateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title"],
    maxlength: [20, "Title can't be more than 20 characters"],
  },
  stage: {
    type: String,
    enum: [
      "battlefield",
      "final-destination",
      "fountain-of-dreams",
      "yoshi's-story",
      "dreamland",
      "stadium",
    ],
    required: [true, "Please provide the stage this savestate is on."],
  },
  ratingsAverage: {
    type: Number,
    default: 0,
    min: [1, "Rating must be greater than 1.0"],
    max: [5, "Rating must be less than 5.0"],
    set: (val) => Math.round(val * 10) / 10,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
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
  file: {
    type: String,
    required: [true, "Please provide a .gci file"],
    validate: {
      validator: function (value) {
        if (!value.endsWith(".gci")) {
          return false;
        }
      },
      message: (props) => `${props.value} doesn't end with .gci extension!`,
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
