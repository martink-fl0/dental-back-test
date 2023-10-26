const { Schema, model } = require("mongoose");

const CampusesPatientsSchema = Schema({
    campus: {
        type: Schema.ObjectId,
        ref: "Campus"
    },
    patient: {
        type: Schema.ObjectId,
        ref: "Patient"
    },
    startDate: {
        type: Date,
        required: true
    },
    state: {
        type: String,
        required: true
    }
});

module.exports = model("CampusesPatients", CampusesPatientsSchema, "campuses-patients");