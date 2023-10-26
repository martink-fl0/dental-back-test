const CampusesPatients = require("../models/campusesPatientsModel");
const Campus = require("../models/campusModel");
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const create = async (req, res) => {
    let body = req.body;
    let patientId = req.query.idPatient;
    let campusId = req.query.idCampus;

    if (!body.startDate || !body.state) {
        return res.status(400).json({
            "status": "error",
            "message": "Missing data"
        });
    }

    let bodyCampusPatient = {
        campus: campusId,
        patient: patientId,
        startDate: body.startDate,
        state: body.state
    }

    try {
        const campusesPatients = await CampusesPatients.find({ $and: [{ campus: bodyCampusPatient.campus.toLowerCase() }, { patient: bodyCampusPatient.patient.toLowerCase() }] });

        if (campusesPatients && campusesPatients.length >= 1) {
            return res.status(200).json({
                "status": "success",
                "message": "The campuses and patients already exists"
            });
        }

        let campusPatient_to_save = new CampusesPatients(bodyCampusPatient);

        try {
            const campusPatientStored = await campusPatient_to_save.save();

            if (!campusPatientStored) {
                return res.status(500).json({
                    "status": "error",
                    "message": "No campus and patient saved"
                });
            }

            return res.status(200).json({
                "status": "success",
                "message": "Campus and patient registered",
                "campusPatient": campusPatientStored
            });
        } catch (error) {
            return res.status(500).json({
                "status": "error",
                "message": "Error while saving campus and patient",
                error
            });
        }
    } catch {
        return res.status(500).json({
            "status": "error",
            "message": "Error while finding campus and patient duplicate"
        });
    }
}

const createFromCampus = async (req, res) => {
    let body = req.body;
    let patientId = req.query.idPatient;
    let userId = req.user.id;
    let campusId;

    try {
        const campus = await Campus.findOne({ user: userId });
      
        if (!campus) {
          return res.status(404).json({
            status: "Error",
            message: "No campus available..."
          });
        }
      
        campusId = campus._id;
      
    } catch (error) {
        return res.status(500).json({
          status: "error",
          error
        });
    }

    if (!body.startDate || !body.state) {
        return res.status(400).json({
            "status": "error",
            "message": "Missing data"
        });
    }

    let bodyCampusPatient = {
        campus: campusId,
        patient: patientId,
        startDate: body.startDate,
        state: body.state
    }

    try {
        const campusesPatients = await CampusesPatients.find({ $and: [{ campus: bodyCampusPatient.campus }, { patient: bodyCampusPatient.patient.toLowerCase() }] });

        if (campusesPatients && campusesPatients.length >= 1) {
            return res.status(400).json({
                "status": "success",
                "message": "La persona ya ha sido registrada en la sede"
            });
        }

        let campusPatient_to_save = new CampusesPatients(bodyCampusPatient);

        try {
            const campusPatientStored = await campusPatient_to_save.save();

            if (!campusPatientStored) {
                return res.status(500).json({
                    "status": "error",
                    "message": "No campus and patient saved"
                });
            }

            const populatedCampusPatient = await CampusesPatients.findById(campusPatientStored._id).populate([{path: "patient", populate: { path: "personData"}}, {path: 'campus', populate: { path: 'user'}}]);

            return res.status(200).json({
                "status": "success",
                "message": "Campus and patient registered",
                "campusPatient": populatedCampusPatient
            });
        } catch (error) {
            return res.status(500).json({
                "status": "error",
                "message": "Error while saving campus and patient",
                error
            });
        }
    } catch {
        return res.status(500).json({
            "status": "error",
            "message": "Error while finding campus and patient duplicate"
        });
    }
}

const list = (req, res) => {
    CampusesPatients.find().populate([{ path: "patient", populate: { path: "personData" } }, "campus"]).sort('_id').then(campusesPatients => {
        if (!campusesPatients) {
            return res.status(404).json({
                status: "Error",
                message: "No campuses and patients avaliable..."
            });
        }

        return res.status(200).json({
            "status": "success",
            campusesPatients
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const getByCampusId = (req, res) => {
    let campusId = req.query.idCampus;

    CampusesPatients.find({ campus: campusId }).populate({ path: "patient", populate: { path: "personData" } }).sort('_id').then(campusesPatients => {
        if (!campusesPatients) {
            return res.status(404).json({
                status: "Error",
                message: "No campusesPatients avaliable..."
            });
        }

        return res.status(200).json({
            "status": "success",
            campusesPatients
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const getByMyCampus = async (req, res) => {
    let userId = new ObjectId(req.user.id);

    CampusesPatients.find().populate([{ path: "patient", populate: { path: "personData" } }, { path: "campus", populate: { path: "user", match: { _id: userId } } }]).sort('_id').then(campusesPatients => {
        campusesPatients = campusesPatients.filter(campusPatient => campusPatient.campus.user);

        if (campusesPatients.length == 0) {
            return res.status(404).json({
                status: "Error",
                message: "No existen datos por el momento"
            });
        }

        return res.status(200).json({
            "status": "success",
            campusesPatients
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const searchPatientsByMyCampus = async (req, res) => {
    let userId = req.user.id;
    let campusId;

    try {
        const campus = await Campus.findOne({ user: userId });
      
        if (!campus) {
          return res.status(404).json({
            status: "Error",
            message: "No campus available..."
          });
        }
      
        campusId = campus._id;
      
    } catch (error) {
        return res.status(500).json({
          status: "error",
          error
        });
    }

    CampusesPatients.find({ campus: campusId }).populate({ path: 'patient', populate: { path: 'personData', match: { names: { $regex: req.query.patientName, $options: 'i' } } } }).sort('_id').then(campusesPatients => {
        campusesPatients = campusesPatients.filter(campusPatient => campusPatient.patient.personData);
        
        if (campusesPatients.length == 0) {
            return res.status(404).json({
                status: "Error",
                message: "Paciente/pacientes no encontrados"
            });
        }

        return res.status(200).json({
            "status": "success",
            campusesPatients
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const searchPatientsByMyCampusAndDni = async (req, res) => {
    let userId = req.user.id;
    let campusId;

    try {
        const campus = await Campus.findOne({ user: userId });
      
        if (!campus) {
          return res.status(404).json({
            status: "Error",
            message: "No campus available..."
          });
        }
      
        campusId = campus._id;
      
    } catch (error) {
        return res.status(500).json({
          status: "error",
          error
        });
    }

    CampusesPatients.find({ campus: campusId }).populate([{ path: 'patient', populate: { path: 'personData', match: { dni: req.query.dni } } }, "campus"]).sort('_id').then(campusesPatient => {
        campusesPatient = campusesPatient.filter(campusPatient => campusPatient.patient.personData)

        if (!campusesPatient || campusesPatient.length == 0) {
            return res.status(404).json({
                status: "Error",
                message: "No existe paciente en sede"
            });
        }

        return res.status(200).json({
            "status": "success",
            campusesPatient
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const searchPatientsByMyCampusAndPatientId = async (req, res) => {
    let userId = req.user.id;
    let patientId = new ObjectId(req.query.idPatient);
    let campusId;

    try {
        const campus = await Campus.findOne({ user: userId });
      
        if (!campus) {
          return res.status(404).json({
            status: "Error",
            message: "No campus available..."
          });
        }
      
        campusId = campus._id;
      
    } catch (error) {
        return res.status(500).json({
          status: "error",
          error
        });
    }

    CampusesPatients.find({ campus: campusId }).populate([{ path: 'patient', match: { _id: patientId } }, "campus"]).sort('_id').then(campusesPatient => {
        campusesPatient = campusesPatient.filter(campusPatient => campusPatient.patient)

        if (!campusesPatient || campusesPatient.length == 0) {
            return res.status(404).json({
                status: "Error",
                message: "No existe paciente en sede"
            });
        }

        return res.status(200).json({
            "status": "success",
            campusesPatient
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const getByPatientId = (req, res) => {
    let patientId = req.query.idPatient;

    CampusesPatients.find({ patient: patientId }).populate("campus").sort('_id').then(campusesPatients => {
        if (!campusesPatients) {
            return res.status(404).json({
                status: "Error",
                message: "No campusesPatients avaliable..."
            });
        }

        return res.status(200).json({
            "status": "success",
            campusesPatients
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const deleteByPatientId = async (req, res) => {
    let userId = req.user.id;
    let patientId = req.query.idPatient;
    let campusId;

    try {
        const campus = await Campus.findOne({ user: userId });
      
        if (!campus) {
          return res.status(404).json({
            status: "Error",
            message: "No campus available..."
          });
        }
      
        campusId = campus._id;
      
    } catch (error) {
        return res.status(500).json({
          status: "error",
          error
        });
    }

    CampusesPatients.findOneAndDelete({ "campus": campusId, "patient": patientId }).then(campusPatientDeleted => {
        if (!campusPatientDeleted) {
            return res.status(500).json({
                "status": "error",
                "message": "No Campus Patient found"
            });
        }
        return res.status(200).json({
            "status": "success",
            "message": "Campus Patient deleted successfully"
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            "message": "Error while deleting campus patient"
        });
    });
}

module.exports = {
    create,
    createFromCampus,
    list,
    getByCampusId,
    getByMyCampus,
    searchPatientsByMyCampus,
    searchPatientsByMyCampusAndDni,
    searchPatientsByMyCampusAndPatientId,
    getByPatientId,
    deleteByPatientId
}