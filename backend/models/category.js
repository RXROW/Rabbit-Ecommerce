const mongoose = require("mongoose");

const categortSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, " category name required "],
      unique: [true, " category already exist "],
      minLength: [3, "too short category name "],
      maxLength: [30, " too long category name "],
      trim: true,
    },

    slug: {
      type: String,
      lowercase: true,
    },
    image: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("category", categortSchema);
