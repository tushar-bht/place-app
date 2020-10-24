var mongoose = require("mongoose");

var PlacesSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: {
    lat: Number,
    lng: Number,
  },
  image: { type: String, required: true },
  address: { type: String, required: true },
  creator: {
    type: mongoose.Types.ObjectId,
    ref: "user",
    required: true,
  },
});

module.exports = mongoose.model("Place", PlacesSchema);
