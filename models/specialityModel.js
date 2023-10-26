const { Schema, model } = require("mongoose");

const SpecialitySchema = Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

module.exports = model("Speciality", SpecialitySchema, "specialities");