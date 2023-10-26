const Speciality = require("../models/specialityModel");

const create = async (req, res) => {
    let body = req.body;

    if (!body.name || !body.description) {
        return res.status(400).json({
            "status": "error",
            "message": "Missing data"
        });
    }

    let bodySpeciality = {
        name: body.name,
        description: body.description
    }

    try {
        const specialities = await Speciality.find({ $or: [{ name: bodySpeciality.name.toLowerCase() }] });

        if (specialities && specialities.length >= 1) {
            return res.status(200).json({
                "status": "success",
                "message": "The speciality already exists"
            });
        }

        let speciality_to_save = new Speciality(bodySpeciality);

        try {
            const specialityStored = await speciality_to_save.save();

            if (!specialityStored) {
                return res.status(500).json({
                    "status": "error",
                    "message": "No speciality saved"
                });
            }

            return res.status(200).json({
                "status": "success",
                "message": "Speciality registered",
                "speciality": specialityStored
            });
        } catch (error) {
            return res.status(500).json({
                "status": "error",
                "message": "Error while saving speciality",
                error
            });
        }
    } catch {
        return res.status(500).json({
            "status": "error",
            "message": "Error while finding speciality duplicate"
        });
    }
}

const list = (req, res) => {
    Speciality.find().sort('_id').then(specialities => {
        if (!specialities) {
            return res.status(404).json({
                status: "Error",
                message: "No specialities avaliable..."
            });
        }

        return res.status(200).json({
            "status": "success",
            specialities
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

module.exports = {
    create,
    list
}