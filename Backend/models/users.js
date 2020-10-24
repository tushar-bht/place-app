const { Schema } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const mongoose = require("mongoose");

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 5 },
  image: { type: String, required: true },
  places: [{ type: mongoose.Types.ObjectId, ref: "Place", required: true }],
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("user", userSchema);
