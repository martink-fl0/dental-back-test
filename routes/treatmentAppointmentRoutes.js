const express = require("express");
const router = express.Router();
const TreatmentAppointmentController = require("../controllers/treatmentAppointmentController");

const check = require("../authorization/auth");

router.post("/", TreatmentAppointmentController.create);
router.get("/list", TreatmentAppointmentController.list);
router.get("/", TreatmentAppointmentController.treatmentAppointmentById);
router.get("/treatmentDetail", TreatmentAppointmentController.getByTreatmentDetailId);
router.get("/patient", check.auth, TreatmentAppointmentController.getByPatientId);
router.get("/doctor", check.auth, TreatmentAppointmentController.getByDoctorId);
router.get("/campusDoctor", check.auth, TreatmentAppointmentController.getDoctorsAppointmentsGroupedByCampusToken);
router.get("/campusPatient", check.auth, TreatmentAppointmentController.getPatientsAppointmentsGroupedByCampusToken);
router.get("/myTreatmentAppointmentsByCampus", check.auth, TreatmentAppointmentController.myTreatmentAppointmentsByCampus);
router.get("/myTreatmentAppointmentsClinicByCampus", check.auth, TreatmentAppointmentController.myTreatmentAppointmentsClinicByCampus);
router.get("/myTreatmentAppointmentsByCampusAgenda", check.auth, TreatmentAppointmentController.myTreatmentAppointmentsByCampusForAgenda);
router.put("/", TreatmentAppointmentController.editTreatmentAppointment);

module.exports = router;