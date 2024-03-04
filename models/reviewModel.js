const mongoose = require("mongoose");
const Savestate = require("./savestateModel");

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "A review must contain a rating!"],
    },
    createdAt: { type: Date, default: Date.now() },
    savestate: {
      type: mongoose.Schema.ObjectId,
      ref: "Savestate",
      required: [true, "Review must belong to a savestate!"],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user!"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
  }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "username",
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (savestateId) {
  const stats = await this.aggregate([
    {
      $match: { savestate: savestateId },
    },
    {
      $group: {
        _id: "$savestate",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);
  if (stats.length > 0) {
    await Savestate.findByIdAndUpdate(savestateId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Savestate.findByIdAndUpdate(savestateId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post("save", function () {
  this.constructor.calcAverageRatings(this.savestate);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.review = await this.clone().findOne();
  next();
});
reviewSchema.post(/^findOneAnd/, async function () {
  await this.review.constructor.calcAverageRatings(this.review.savestate);
});

reviewSchema.index({ savestate: 1, user: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
