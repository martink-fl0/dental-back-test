const { Schema, model } = require("mongoose");

const ConsultationSchema = Schema({
    patient: {
        type: Schema.ObjectId,
        ref: "Patient"
    },
    doctor: {
        type: Schema.ObjectId,
        ref: "Doctor"
    },
    campus: {
        type: Schema.ObjectId,
        ref: "Campus"
    },
    consultationReason: {
        type: String,
        default: "No posee motivo"
    },
    cost: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        required: true
    },
    hour: {
        type: String,
        required: true
    }
});

module.exports = model("Consultation", ConsultationSchema, "consultations");