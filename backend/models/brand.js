const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, " brand name required "],
      unique: [true, " brand already exist "],
      minLength: [3, "too short brand name "],
      maxLength: [30, " too long brand name "],
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

module.exports = mongoose.model("Brand", brandSchema);
