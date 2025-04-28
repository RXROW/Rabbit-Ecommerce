const mongoose = require("mongoose");

const supCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, " category name required "],
      unique: [true, " category already exist "],
      minLength: [3, "too short category name "],
      maxLength: [30, " too long category name "],
    },

    slug: { type: String, lowercase: true },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "category",
      required: [true, " must have category"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SupCategory", supCategorySchema);
