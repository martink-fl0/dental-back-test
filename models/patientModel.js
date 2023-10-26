const { Schema, model } = require("mongoose");

const PatientSchema = Schema({
    personData: {
        type: Schema.ObjectId,
        ref: "PersonData"
    },
    user: {
        type: Schema.ObjectId,
        ref: "User"
    },
});

module.exports = model("Patient", PatientSchema, "patients");