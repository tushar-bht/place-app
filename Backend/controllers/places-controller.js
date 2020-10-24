const mongoose = require("mongoose");
const fs = require("fs");

var NodeGeocoder = require("node-geocoder");

const User = require("../models/users");
const PlacesModel = require("../models/place");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");

//.......................................................................................

var geocoder = NodeGeocoder({
  provider: "opencage",
  apiKey: process.env.OPENCAGE_API_KEY,
});

async function geoLocation(address) {
  let location = null;
  try {
    location = await geocoder.geocode(address);
    location = { lat: location[0].latitude, lng: location[0].longitude };
    return location;
  } catch (err) {
    throw new HttpError(
      "the address does not seem to exist please change be more precise"
    );
  }
}

//...................................................................................
const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place = null;
  try {
    place = await PlacesModel.findById(placeId);
  } catch (err) {
    return next(new HttpError("sorry could not find the place", 402));
  }
  if (!place) {
    var error = new HttpError(
      "Sorry Required Url orr information Not Found !",
      404
    );
    return next(error);
  }
  res.json({ place: place.toObject({ getters: true }) });
};
//.......................................................................................
const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let userWithPlaces;
  try {
    userWithPlaces = await User.findById(userId).populate("places");
  } catch (err) {
    return next(new HttpError("failed to fetch the user places", 404));
  }

  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    var error = new HttpError(
      "failed to find places for the provided userId",
      500
    );
    return next(error);
  }
  res.json({
    places: userWithPlaces.places.map((place) =>
      place.toObject({ getters: true })
    ),
  });
};
//.......................................................................................
async function createPlace(req, res, next) {
  const validationError = validationResult(req);
  if (!validationError.isEmpty())
    return next(new HttpError("invalid place information", 402));
  const { title, description, address } = req.body;
  const creator = req.userData.userId;

  var location = null;
  try {
    location = await geoLocation(address);
  } catch (err) {
    return next(err);
  }

  const createdPlace = new PlacesModel({
    title: title,
    description,
    location,
    address,
    creator,
    image: req.file.path,
  });
  let user;

  try {
    user = await User.findById(creator);
  } catch (err) {
    return next(new HttpError("Creating place failed", 500));
  }
  if (!user) return next(new HttpError("Could not find the user", 404));
  let sess;
  try {
    sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    await user.places.push(createdPlace); //special operation done by mongoose to do behind the scene establish the connection
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    return next(new HttpError("Failed to create place", 500));
  }

  res.status(201).json({ createdPlace: createdPlace });
}

//......................................................................................
const updatePlace = async (req, res, next) => {
  const validationError = validationResult(req);
  if (!validationError.isEmpty())
    return next(new HttpError("invalid details", 403));

  const placeId = req.params.pid;
  var { title, description } = req.body;
  var updatedPlace;
  try {
    updatedPlace = await PlacesModel.findById(placeId);

    if (updatedPlace.creator.toString() !== req.userData.userId)
      return next(
        new HttpError("You are not allowed to update this place", 401)
      );
    updatedPlace.title = title;
    updatedPlace.description = description;
    await updatedPlace.save();
  } catch (err) {
    return next(new HttpError("Some error occured while updating place", 404));
  }

  if (!updatedPlace) return next("The required place does not exist");
  res.status(200).json({ place: updatedPlace.toObject({ getters: true }) });
};

//............................................................................................
const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  let deletingPlace;
  try {
    deletingPlace = await PlacesModel.findById(placeId).populate("creator");
  } catch (err) {
    return next(
      new HttpError("something wrong happened during the process", 500)
    );
  }
  try {
    if (deletingPlace.creator.id !== req.userData.userId)
      throw new Error("wrong user");
  } catch (err) {
    return next(new HttpError("wrong user, cant delete place ", 401));
  }

  let sess;
  const imagePath = deletingPlace.image;
  try {
    sess = await mongoose.startSession();
    await sess.startTransaction();
    await deletingPlace.creator.places.pull(deletingPlace);
    await deletingPlace.creator.save({ session: sess });
    await deletingPlace.remove({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    return next("deleting place failed", 500);
  }
  fs.unlink(imagePath, (err) => {
    console.log(err);
  });
  res.status(200).json({ message: "Deleted place successfully" });
};
//..........................................................................................
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
exports.geoLocation = geoLocation;
