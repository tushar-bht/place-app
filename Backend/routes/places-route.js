const express = require("express");
const { body } = require("express-validator");

const checkAuth = require("../middlewares/check-auth");
const fileUpload = require("../middlewares/file-upload");
const placeControllers = require("../controllers/places-controller");

const router = express.Router();
router.get("/:pid", placeControllers.getPlaceById);
router.get("/user/:uid", placeControllers.getPlacesByUserId);

router.use(checkAuth);
router
  .patch(
    "/:pid",
    [body("title").not().isEmpty(), body("description").isLength(5)],
    placeControllers.updatePlace
  )
  .delete("/:pid", placeControllers.deletePlace);

router.post(
  "/",
  fileUpload.single("image"),
  [
    body("title").not().isEmpty(),
    body("description").isLength({ min: 5 }),
    body("address").not().isEmpty(),
    body("creator").not().isEmpty(),
  ],
  placeControllers.createPlace
);

module.exports = router;
