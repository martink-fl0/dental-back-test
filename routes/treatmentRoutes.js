const express = require("express");
const router = express.Router();
const TreatmentController = require("../controllers/treatmentController");

router.post("/", TreatmentController.create);
router.get("/list", TreatmentController.list);
router.get("/", TreatmentController.treatmentById);
router.put("/", TreatmentController.editTreatment);

module.exports = router;