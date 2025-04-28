const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required "],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      uniqe: true,
      lowercase: true,
      required: [true, "eamil required"],
    },
    password: {
      type: String,
      required: [true, "password required"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    phone: { type: String },
    avater: { type: String }, 
    active : { type : Boolean , default : true} , 
    token : { type : String}
  },
  { timestamps: true }
);


module.exports = mongoose.model("User", userSchema);
