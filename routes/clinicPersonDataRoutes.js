const express = require("express");
const router = express.Router();
const ClinicPersonDataController = require("../controllers/clinicPersonDataController");

const check = require("../authorization/auth");

router.post("/campus", check.auth, ClinicPersonDataController.createFromCampus);
router.get("/list", ClinicPersonDataController.list);
router.get("/dni", check.auth, ClinicPersonDataController.searchClinicPersonDataByDni);
router.get("/campus", ClinicPersonDataController.getByCampusId);
router.get("/myCampus", check.auth, ClinicPersonDataController.getByMyCampus);
router.get("/search", check.auth, ClinicPersonDataController.searchDoctorsByMyCampus);
router.get("/doctor", ClinicPersonDataController.getByDoctorId);
router.delete("/", check.auth, ClinicPersonDataController.deleteByDoctorId);

module.exports = router;