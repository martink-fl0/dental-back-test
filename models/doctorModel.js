const { Schema, model } = require("mongoose");

const DoctorSchema = Schema({
    personData: {
        type: Schema.ObjectId,
        ref: "PersonData"
    },
    tuitionNumber: {
        type: String,
        required: true
    },
    speciality: {
        type: Schema.ObjectId,
        ref: "Speciality"
    },
    user: {
        type: Schema.ObjectId,
        ref: "User"
    },
});

module.exports = model("Doctor", DoctorSchema, "doctors");