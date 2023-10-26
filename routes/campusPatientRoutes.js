const express = require("express");
const router = express.Router();
const CampusPatientController = require("../controllers/campusPatientController");

const check = require("../authorization/auth");

router.post("/", CampusPatientController.create);
router.post("/campus", check.auth, CampusPatientController.createFromCampus);
router.get("/list", CampusPatientController.list);
router.get("/campus", CampusPatientController.getByCampusId);
router.get("/myCampus", check.auth, CampusPatientController.getByMyCampus);
router.get("/search", check.auth, CampusPatientController.searchPatientsByMyCampus);
router.get("/dni", check.auth, CampusPatientController.searchPatientsByMyCampusAndDni);
router.get("/patientId", check.auth, CampusPatientController.searchPatientsByMyCampusAndPatientId);
router.get("/patient", CampusPatientController.getByPatientId);
router.delete("/", check.auth, CampusPatientController.deleteByPatientId);

module.exports = router;