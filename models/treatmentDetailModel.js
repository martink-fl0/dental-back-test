const { Schema, model } = require("mongoose");

const TreatmentDetailSchema = Schema({
    consultationResult: {
        type: Schema.ObjectId,
        ref: "ConsultationResult"
    },
    description: {
        type: String,
        required: true
    },
    initialCost: {
        type: String,
        required: true
    },
    finalCost: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        default: Date.now
    },
    patient: {
        type: Schema.ObjectId,
        ref: "Patient"
    },
    status: {
        type: String,
        default: "Incomplete"
    }
});

module.exports = model("TreatmentDetail", TreatmentDetailSchema, "treatmentDetails");