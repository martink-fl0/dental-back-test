const { Schema, model } = require("mongoose");

const ConsultationResultSchema = Schema({
    problemFound: {
        type: String,
        required: true
    },
    consultation: {
        type: Schema.ObjectId,
        ref: "Consultation"
    },
    priority: {
        type: String,
        required: true
    },
    treatment: {
        type: Schema.ObjectId,
        ref: "Treatment"
    },
    initialCost: {
        type: String,
        required: true
    },
    discount: {
        type: String,
        required: true
    },
    finalCost: {
        type: String,
        required: true
    },
    discountValid: {
        type: Boolean,
        required: true
    }
});

module.exports = model("ConsultationResult", ConsultationResultSchema, "consultationResults");