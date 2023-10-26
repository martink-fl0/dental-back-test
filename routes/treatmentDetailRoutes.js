const express = require("express");
const router = express.Router();
const TreatmentDetailController = require("../controllers/treatmentDetailController");

const check = require("../authorization/auth");

router.post("/", TreatmentDetailController.create);
router.get("/list", TreatmentDetailController.list);
router.get("/", TreatmentDetailController.treatmentDetailById);
router.get("/consultationResult", TreatmentDetailController.getByConsultationResultId);
router.get("/myTreatmentDetailsByCampus", check.auth, TreatmentDetailController.myTreatmentDetailsByCampus);
router.get("/myTreatmentDetailsClinicByCampus", check.auth, TreatmentDetailController.myTreatmentDetailsClinicByCampus);
router.put("/", TreatmentDetailController.editTreatmentDetail);

module.exports = router;