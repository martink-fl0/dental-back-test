const Campus = require("../models/campusModel");

const create = async (req, res) => {
    let body = req.body;
    let userId = req.user.id;
    let directorId = req.query.idDirector;
    let clinicId = req.query.idClinic;

    if (!body.openingDate || !body.address || !body.phoneNumber || !body.name || !body.description || !body.ruc) {
        return res.status(400).json({
            "status": "error",
            "message": "Missing data"
        });
    }

    let bodyCampus = {
        openingDate: body.openingDate,
        address: body.address,
        phoneNumber: body.phoneNumber,
        name: body.name,
        description: body.description,
        ruc: body.ruc,
        director: directorId,
        user: userId,
        clinic: clinicId
    }

    try {
        const campuses = await Campus.find({ $or: [{ ruc: bodyCampus.ruc.toLowerCase() }] });

        if (campuses && campuses.length >= 1) {
            return res.status(200).json({
                "status": "success",
                "message": "The campus already exists"
            });
        }

        let campus_to_save = new Campus(bodyCampus);

        try {
            const campusStored = await campus_to_save.save();

            if (!campusStored) {
                return res.status(500).json({
                    "status": "error",
                    "message": "No campus saved"
                });
            }

            return res.status(200).json({
                "status": "success",
                "message": "Campus registered",
                "campus": campusStored
            });
        } catch (error) {
            return res.status(500).json({
                "status": "error",
                "message": "Error while saving campus",
                error
            });
        }
    } catch {
        return res.status(500).json({
            "status": "error",
            "message": "Error while finding campus duplicate"
        });
    }
}

const myCampus = (req, res) => {
    let userId = req.user.id;

    Campus.findOne({ user: userId }).populate(["director", "user", "clinic"]).then(campus => {
        if (!campus) {
            return res.status(404).json({
                status: "Error",
                message: "No campus avaliable..."
            });
        }

        return res.status(200).json({
            "status": "success",
            campus
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const list = (req, res) => {
    Campus.find().populate("director clinic").sort('_id').then(campuses => {
        if (!campuses) {
            return res.status(404).json({
                status: "Error",
                message: "No campuses avaliable..."
            });
        }

        return res.status(200).json({
            "status": "success",
            campuses
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const campusById = (req, res) => {
    Campus.findById(req.query.idCampus).then(campus => {
        if (!campus) {
            return res.status(404).json({
                "status": "error",
                "message": "Campus doesn't exist"
            });
        }

        return res.status(200).json({
            "status": "success",
            "campus": campus
        });
    }).catch(() => {
        return res.status(404).json({
            "status": "error",
            "message": "Error while finding campus"
        });
    });
}

const editCampus = (req, res) => {
    let id = req.query.idCampus;

    Campus.findOneAndUpdate({ _id: id }, req.body, { new: true }).then(campusUpdated => {
        if (!campusUpdated) {
            return res.status(404).json({
                status: "error",
                mensaje: "Campus not found"
            });
        }
        return res.status(200).send({
            status: "success",
            campus: campusUpdated
        });
    }).catch(() => {
        return res.status(404).json({
            status: "error",
            mensaje: "Error while finding and updating campus"
        });
    });
}

const getByClinicId = (req, res) => {
    let clinicId = req.query.idClinic;

    Campus.find({ clinic: clinicId }).sort('_id').then(campuses => {
        if (!campuses) {
            return res.status(404).json({
                status: "Error",
                message: "No campuses avaliable..."
            });
        }

        return res.status(200).json({
            "status": "success",
            campuses
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const getAllCampusByClinicIdFromCampus = async (req, res) => {
    let userId = req.user.id;
    let clinicId;

    try {
        const campus = await Campus.findOne({ user: userId });
      
        if (!campus) {
          return res.status(404).json({
            status: "Error",
            message: "No campus available..."
          });
        }
      
        clinicId = campus.clinic;
      
    } catch (error) {
        return res.status(500).json({
          status: "error",
          error
        });
    }

    Campus.find({ clinic: clinicId }).sort('_id').then(campuses => {
        if (!campuses) {
            return res.status(404).json({
                status: "Error",
                message: "No campuses avaliable..."
            });
        }

        return res.status(200).json({
            "status": "success",
            campuses
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
    myCampus,
    list,
    campusById,
    editCampus,
    getByClinicId,
    getAllCampusByClinicIdFromCampus
}