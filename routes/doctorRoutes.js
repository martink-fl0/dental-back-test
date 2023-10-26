const express = require("express");
const router = express.Router();
const DoctorController = require("../controllers/doctorController");

const check = require("../authorization/auth");

router.post("/", check.auth, DoctorController.create);
router.post("/personData", DoctorController.createWithoutUser);
router.get("/myDoctor", check.auth, DoctorController.myDoctor);
router.get("/list", DoctorController.list);
router.get("/", DoctorController.doctorById);
router.get("/personData", DoctorController.searchDoctorByPersonDataId);

module.exports = router;