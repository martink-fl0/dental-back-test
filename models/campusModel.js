const { Schema, model } = require("mongoose");

const CampusSchema = Schema({
    openingDate: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phoneNumber: {
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
    ruc: {
        type: String,
        required: true
    },
    director: {
        type: Schema.ObjectId,
        ref: "PersonData"
    },
    user: {
        type: Schema.ObjectId,
        ref: "User"
    },
    clinic: {
        type: Schema.ObjectId,
        ref: "Clinic"
    }
    //pendiente poner: Imagen
});

module.exports = model("Campus", CampusSchema, "campuses");