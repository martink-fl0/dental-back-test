const express = require("express");
const router = express.Router();
const ConsultationResultController = require("../controllers/consultationResultController");

const check = require("../authorization/auth");

router.post("/", ConsultationResultController.create);
router.get("/list", ConsultationResultController.list);
router.get("/", ConsultationResultController.consultationResultById);
router.get("/consultation", ConsultationResultController.getByConsultationId);
router.get("/myConsultationsResultsByCampus", check.auth, ConsultationResultController.myConsultationResultsByCampus);
router.get("/myConsultationsResultsClinicByCampus", check.auth, ConsultationResultController.myConsultationResultsClinicByCampus);
router.put("/", ConsultationResultController.editConsultationResult);

module.exports = router;