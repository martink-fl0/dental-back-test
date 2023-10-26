const express = require("express");
const router = express.Router();
const AgendaController = require("../controllers/agendaController");

const check = require("../authorization/auth");

router.get("/", check.auth, AgendaController.getAgendaBySede);
router.get("/history", check.auth, AgendaController.getHistoryBySede);

module.exports = router;