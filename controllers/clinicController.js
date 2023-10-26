const Clinic = require("../models/clinicModel");

const create = async (req, res) => {
    let body = req.body;
    let userId = req.user.id;
    let directorId = req.query.idDirector;

    if (!body.ruc || !body.name || !body.description || !body.startDate || !body.phoneNumber) {
        return res.status(400).json({
            "status": "error",
            "message": "Missing data"
        });
    }

    let bodyClinic = {
        ruc: body.ruc,
        name: body.name,
        description: body.description,
        user: userId,
        startDate: body.startDate,
        phoneNumber: body.phoneNumber,
        director: directorId
    }

    try {
        const clinics = await Clinic.find({ $or: [{ ruc: bodyClinic.ruc.toLowerCase() }] });

        if (clinics && clinics.length >= 1) {
            return res.status(200).json({
                "status": "success",
                "message": "The clinic already exists"
            });
        }

        let clinic_to_save = new Clinic(bodyClinic);

        try {
            const clinicStored = await clinic_to_save.save();

            if (!clinicStored) {
                return res.status(500).json({
                    "status": "error",
                    "message": "No clinic saved"
                });
            }

            return res.status(200).json({
                "status": "success",
                "message": "Clinic registered",
                "clinic": clinicStored
            });
        } catch (error) {
            return res.status(500).json({
                "status": "error",
                "message": "Error while saving clinic",
                error
            });
        }
    } catch {
        return res.status(500).json({
            "status": "error",
            "message": "Error while finding clinic duplicate"
        });
    }
}

const myClinic = (req, res) => {
    let userId = req.user.id;

    Clinic.findOne({ user: userId }).populate("director").then(clinic => {
        if (!clinic) {
            return res.status(404).json({
                status: "Error",
                message: "No clinic avaliable..."
            });
        }

        return res.status(200).json({
            "status": "success",
            clinic
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const list = (req, res) => {
    Clinic.find().populate("director").sort('_id').then(clinics => {
        if (!clinics) {
            return res.status(404).json({
                status: "Error",
                message: "No clinics avaliable..."
            });
        }

        return res.status(200).json({
            "status": "success",
            clinics
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const clinicById = (req, res) => {
    Clinic.findById(req.query.idClinic).then(clinic => {
        if (!clinic) {
            return res.status(404).json({
                "status": "error",
                "message": "Clinic doesn't exist"
            });
        }

        return res.status(200).json({
            "status": "success",
            "clinic": clinic
        });
    }).catch(() => {
        return res.status(404).json({
            "status": "error",
            "message": "Error while finding clinic"
        });
    });
}

const editClinic = (req, res) => {
    let id = req.query.idClinic;

    Clinic.findOneAndUpdate({ _id: id }, req.body, { new: true }).then(clinicUpdated => {
        if (!clinicUpdated) {
            return res.status(404).json({
                status: "error",
                mensaje: "Clinic not found"
            });
        }
        return res.status(200).send({
            status: "success",
            clinic: clinicUpdated
        });
    }).catch(() => {
        return res.status(404).json({
            status: "error",
            mensaje: "Error while finding and updating clinic"
        });
    });
}

module.exports = {
    create,
    myClinic,
    list,
    clinicById,
    editClinic
}