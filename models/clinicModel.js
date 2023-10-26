const { Schema, model } = require("mongoose");

const ClinicSchema = Schema({
    ruc: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    user: {
        type: Schema.ObjectId,
        ref: "User"
    },
    startDate: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    director: {
        type: Schema.ObjectId,
        ref: "PersonData"
    }
    //pendiente poner: Imagen
});

module.exports = model("Clinic", ClinicSchema, "clinics");