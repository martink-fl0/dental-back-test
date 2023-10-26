const express = require("express");
const router = express.Router();
const PersonDataController = require("../controllers/personDataController");

router.post("/", PersonDataController.create);
router.get("/list", PersonDataController.list);
router.get("/", PersonDataController.personById);
router.put("/", PersonDataController.editPerson);
router.get("/dni", PersonDataController.searchPersonDataByDni);

module.exports = router;