const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD_KEY}@cluster0.ks0zv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    app.listen(process.env.PORT || "5000", () => {
      console.log("server started at local host 5000");
    });
  })
  .catch((error) => console.log(error));

const HttpError = require("./models/http-error.js");

const placesRoutes = require("./routes/places-route.js");
const usersRoutes = require("./routes/users-routes");

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-allow-Methods", "GET,POST,PATCH,DELETE");
  next();
});

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use("/api/places", placesRoutes);

app.use("/api/users", usersRoutes);
app.use((req, res, next) => {
  const error = new HttpError("Could not find the route ", 404);
  next(error);
});

//error handling..........
app.use((error, req, res, next) => {
  if (req.file)
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  res
    .status(error.code || "500")
    .json({ message: error.message, status: error.code });
});
