const express = require("express");
const { body } = require("express-validator");

const fileUpload = require("../middlewares/file-upload");
const userControllers = require("../controllers/users-controllers");
const router = express.Router();

router.get("/", userControllers.getUsers);

router.post(
  "/signup",
  fileUpload.single("image"),
  [
    body("name").not().isEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 8 }),
  ],
  userControllers.signup
);

router.post(
  "/signin",
  [body("email").isEmail(), body("password").isLength({ min: 8 })],
  userControllers.signin
);

module.exports = router;
