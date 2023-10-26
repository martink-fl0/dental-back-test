const express = require("express");
const router = express.Router();
const ClinicController = require("../controllers/clinicController");

const check = require("../authorization/auth");

router.post("/", check.auth, ClinicController.create);
router.get("/myObject", check.auth, ClinicController.myClinic);
router.get("/list", ClinicController.list);
router.get("/", ClinicController.clinicById);
router.put("/", ClinicController.editClinic);

module.exports = router;