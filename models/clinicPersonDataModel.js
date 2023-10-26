const { Schema, model } = require("mongoose");

const ClinicPersonDataSchema = Schema({
    clinic: {
        type: Schema.ObjectId,
        ref: "Clinic"
    },
    personData: {
        type: Schema.ObjectId,
        ref: "PersonData"
    }
});

module.exports = model("ClinicsPersonData", ClinicPersonDataSchema, "clinic-personData");