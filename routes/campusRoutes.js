const express = require("express");
const router = express.Router();
const CampusController = require("../controllers/campusController");

const check = require("../authorization/auth");

router.post("/", check.auth, CampusController.create);
router.get("/myProfile", check.auth, CampusController.myCampus);
router.get("/list", CampusController.list);
router.get("/", CampusController.campusById);
router.put("/", CampusController.editCampus);
router.get("/clinic", CampusController.getByClinicId);
router.get("/myCampus", check.auth, CampusController.getAllCampusByClinicIdFromCampus);

module.exports = router;