const { Schema, model } = require("mongoose");

const CampusesDoctorsSchema = Schema({
    campus: {
        type: Schema.ObjectId,
        ref: "Campus"
    },
    doctor: {
        type: Schema.ObjectId,
        ref: "Doctor"
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

module.exports = model("CampusesDoctors", CampusesDoctorsSchema, "campuses-doctors");