const express = require("express");
const router = express.Router();
const CampusDoctorController = require("../controllers/campusDoctorController");

const check = require("../authorization/auth");

router.post("/", CampusDoctorController.create);
router.post("/campus", check.auth, CampusDoctorController.createFromCampus);
router.get("/list", CampusDoctorController.list);
router.get("/campus", CampusDoctorController.getByCampusId);
router.get("/myCampus", check.auth, CampusDoctorController.getByMyCampus);
router.get("/search", check.auth, CampusDoctorController.searchDoctorsByMyCampus);
router.get("/dni", check.auth, CampusDoctorController.searchDoctorsByMyCampusAndDni);
router.get("/doctor", CampusDoctorController.getByDoctorId);
router.delete("/", check.auth, CampusDoctorController.deleteByDoctorId);

module.exports = router;