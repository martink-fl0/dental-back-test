const { Schema, model } = require("mongoose");

const TreatmentSchema = Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

module.exports = model("Treatment", TreatmentSchema, "treatments");