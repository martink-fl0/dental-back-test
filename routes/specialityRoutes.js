const express = require("express");
const router = express.Router();
const SpecialityController = require("../controllers/specialityController");

router.post("/", SpecialityController.create);
router.get("/list", SpecialityController.list);

module.exports = router;