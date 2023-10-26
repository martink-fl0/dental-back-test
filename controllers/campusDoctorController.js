const CampusesDoctors = require("../models/campusesDoctorsModel");
const Campus = require("../models/campusModel");
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const create = async (req, res) => {
    let body = req.body;
    let doctorId = req.query.idDoctor;
    let campusId = req.query.idCampus;

    if (!body.startDate || !body.state) {
        return res.status(400).json({
            "status": "error",
            "message": "Missing data"
        });
    }

    let bodyCampusDoctor = {
        campus: campusId,
        doctor: doctorId,
        startDate: body.startDate,
        state: body.state
    }

    try {
        const campusesDoctors = await CampusesDoctors.find({ $and: [{ campus: bodyCampusDoctor.campus.toLowerCase() }, { doctor: bodyCampusDoctor.doctor.toLowerCase() }] });

        if (campusesDoctors && campusesDoctors.length >= 1) {
            return res.status(200).json({
                "status": "success",
                "message": "The campuses and doctors already exists"
            });
        }

        let campusDoctor_to_save = new CampusesDoctors(bodyCampusDoctor);

        try {
            const campusDoctorStored = await campusDoctor_to_save.save();

            if (!campusDoctorStored) {
                return res.status(500).json({
                    "status": "error",
                    "message": "No campus and doctor saved"
                });
            }

            return res.status(200).json({
                "status": "success",
                "message": "Campus and doctor registered",
                "campusDoctor": campusDoctorStored
            });
        } catch (error) {
            return res.status(500).json({
                "status": "error",
                "message": "Error while saving campus and doctor",
                error
            });
        }
    } catch {
        return res.status(500).json({
            "status": "error",
            "message": "Error while finding campus and doctor duplicate"
        });
    }
}

const createFromCampus = async (req, res) => {
    let body = req.body;
    let doctorId = req.query.idDoctor;
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

    let bodyCampusDoctor = {
        campus: campusId,
        doctor: doctorId,
        startDate: body.startDate,
        state: body.state
    }

    try {
        const campusesDoctors = await CampusesDoctors.find({ $and: [{ campus: bodyCampusDoctor.campus }, { doctor: bodyCampusDoctor.doctor.toLowerCase() }] });

        if (campusesDoctors && campusesDoctors.length >= 1) {
            return res.status(400).json({
                "status": "success",
                "message": "La persona ya ha sido registrada en la sede"
            });
        }

        let campusDoctor_to_save = new CampusesDoctors(bodyCampusDoctor);

        try {
            const campusDoctorStored = await campusDoctor_to_save.save();

            if (!campusDoctorStored) {
                return res.status(500).json({
                    "status": "error",
                    "message": "No campus and doctor saved"
                });
            }

            const populatedCampusDoctor = await CampusesDoctors.findById(campusDoctorStored._id).populate([{path: "doctor", populate: [{ path: "personData"}, { path: 'speciality'}]}, {path: 'campus', populate: { path: 'user'}}]);

            return res.status(200).json({
                "status": "success",
                "message": "Campus and doctor registered",
                "campusDoctor": populatedCampusDoctor
            });
        } catch (error) {
            return res.status(500).json({
                "status": "error",
                "message": "Error while saving campus and doctor",
                error
            });
        }
    } catch {
        return res.status(500).json({
            "status": "error",
            "message": "Error while finding campus and doctor duplicate"
        });
    }
}

const list = (req, res) => {
    CampusesDoctors.find().populate([{ path: "doctor", populate: { path: "personData" } }, "campus"]).sort('_id').then(campusesDoctors => {
        if (!campusesDoctors) {
            return res.status(404).json({
                status: "Error",
                message: "No campuses and doctors avaliable..."
            });
        }

        return res.status(200).json({
            "status": "success",
            campusesDoctors
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

    CampusesDoctors.find({ campus: campusId }).populate({ path: "doctor", populate: { path: "personData" } }).sort('_id').then(campusesDoctors => {
        if (!campusesDoctors) {
            return res.status(404).json({
                status: "Error",
                message: "No campusesDoctors avaliable..."
            });
        }

        return res.status(200).json({
            "status": "success",
            campusesDoctors
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

    CampusesDoctors.find().populate([{ path: "doctor", populate: [{ path: "personData" }, { path: "speciality"}] }, { path: "campus", populate: { path: "user", match: { _id: userId } } }]).sort('_id').then(campusesDoctors => {
        campusesDoctors = campusesDoctors.filter(campusDoctor => campusDoctor.campus.user);
        
        if (campusesDoctors.length == 0) {
            return res.status(404).json({
                status: "Error",
                message: "No existen datos por el momento"
            });
        }

        return res.status(200).json({
            "status": "success",
            campusesDoctors
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const searchDoctorsByMyCampus = async (req, res) => {
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

    CampusesDoctors.find({ campus: campusId }).populate({ path: 'doctor', populate: { path: 'personData', match: { names: { $regex: req.query.doctorName, $options: 'i' } } } }).sort('_id').then(campusesDoctors => {
        campusesDoctors = campusesDoctors.filter(campusDoctor => campusDoctor.doctor.personData);
        
        if (campusesDoctors.length == 0) {
            return res.status(404).json({
                status: "Error",
                message: "Doctor/doctores no encontrados"
            });
        }

        return res.status(200).json({
            "status": "success",
            campusesDoctors
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const searchDoctorsByMyCampusAndDni = async (req, res) => {
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

    CampusesDoctors.find({ campus: campusId }).populate([{ path: 'doctor', populate: { path: 'personData', match: { dni: req.query.dni } } }, "campus"]).sort('_id').then(campusesDoctor => {
        campusesDoctor = campusesDoctor.filter(campusDoctor => campusDoctor.doctor.personData)

        if (!campusesDoctor || campusesDoctor.length == 0) {
            return res.status(404).json({
                status: "Error",
                message: "No existe doctor en sede"
            });
        }

        return res.status(200).json({
            "status": "success",
            campusesDoctor
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const getByDoctorId = (req, res) => {
    let doctorId = req.query.idDoctor;

    CampusesDoctors.find({ doctor: doctorId }).populate("campus").sort('_id').then(campusesDoctors => {
        if (!campusesDoctors) {
            return res.status(404).json({
                status: "Error",
                message: "No campusesDoctors avaliable..."
            });
        }

        return res.status(200).json({
            "status": "success",
            campusesDoctors
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const deleteByDoctorId = async (req, res) => {
    let userId = req.user.id;
    let doctorId = req.query.idDoctor;
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

    CampusesDoctors.findOneAndDelete({ "campus": campusId, "doctor": doctorId }).then(campusDoctorDeleted => {
        if (!campusDoctorDeleted) {
            return res.status(500).json({
                "status": "error",
                "message": "No Campus Doctor found"
            });
        }
        return res.status(200).json({
            "status": "success",
            "message": "Campus Doctor deleted successfully"
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            "message": "Error while deleting campus doctor"
        });
    });
}

module.exports = {
    create,
    createFromCampus,
    list,
    getByCampusId,
    getByMyCampus,
    searchDoctorsByMyCampus,
    searchDoctorsByMyCampusAndDni,
    getByDoctorId,
    deleteByDoctorId
}