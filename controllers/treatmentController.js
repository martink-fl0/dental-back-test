const Treatment = require("../models/treatmentModel");

const create = async (req, res) => {
    let body = req.body;

    if (!body.name || !body.description) {
        return res.status(400).json({
            "status": "error",
            "message": "Missing data"
        });
    }

    let bodyTreatment = {
        name: body.name,
        description: body.description
    }

    try {
        const treatments = await Treatment.find({ $or: [{ ruc: bodyTreatment.name.toLowerCase() }] });

        if (treatments && treatments.length >= 1) {
            return res.status(200).json({
                "status": "success",
                "message": "The treatment already exists"
            });
        }

        let treatment_to_save = new Treatment(bodyTreatment);

        try {
            const treatmentStored = await treatment_to_save.save();

            if (!treatmentStored) {
                return res.status(500).json({
                    "status": "error",
                    "message": "No treatment saved"
                });
            }

            return res.status(200).json({
                "status": "success",
                "message": "Treatment registered",
                "treatment": treatmentStored
            });
        } catch (error) {
            return res.status(500).json({
                "status": "error",
                "message": "Error while saving treatment",
                error
            });
        }
    } catch {
        return res.status(500).json({
            "status": "error",
            "message": "Error while finding treatment duplicate"
        });
    }
}

const list = (req, res) => {
    Treatment.find().sort('_id').then(treatments => {
        if (!treatments) {
            return res.status(404).json({
                status: "Error",
                message: "No treatments avaliable..."
            });
        }

        return res.status(200).json({
            "status": "success",
            treatments
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const treatmentById = (req, res) => {
    Treatment.findById(req.query.idTreatment).then(treatment => {
        if (!treatment) {
            return res.status(404).json({
                "status": "error",
                "message": "Treatment doesn't exist"
            });
        }

        return res.status(200).json({
            "status": "success",
            "treatment": treatment
        });
    }).catch(() => {
        return res.status(404).json({
            "status": "error",
            "message": "Error while finding treatment"
        });
    });
}

const editTreatment = (req, res) => {
    let id = req.query.idTreatment;

    Treatment.findOneAndUpdate({ _id: id }, req.body, { new: true }).then(treatmentUpdated => {
        if (!treatmentUpdated) {
            return res.status(404).json({
                status: "error",
                mensaje: "Treatment not found"
            });
        }
        return res.status(200).send({
            status: "success",
            treatment: treatmentUpdated
        });
    }).catch(() => {
        return res.status(404).json({
            status: "error",
            mensaje: "Error while finding and updating treatment"
        });
    });
}

module.exports = {
    create,
    list,
    treatmentById,
    editTreatment
}