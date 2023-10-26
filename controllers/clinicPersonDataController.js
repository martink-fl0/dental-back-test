const ClinicPersonData = require("../models/clinicPersonDataModel");
const Campus = require("../models/campusModel");
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const createFromCampus = async (req, res) => {
    let personDataId = req.query.idPersonData;
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

    let bodyClinicPersonData = {
        clinic: clinicId,
        personData: personDataId
    }

    try {
        const clinicsPersonData = await ClinicPersonData.find({ $and: [{ clinic: bodyClinicPersonData.clinic }, { personData: bodyClinicPersonData.personData }] });

        if (clinicsPersonData && clinicsPersonData.length >= 1) {
            return res.status(400).json({
                "status": "success",
                "message": "La persona ya ha sido registrada en la clinica"
            });
        }

        let clinicPersonData_to_save = new ClinicPersonData(bodyClinicPersonData);

        try {
            const clinicPersonDataStored = await clinicPersonData_to_save.save();

            if (!clinicPersonDataStored) {
                return res.status(500).json({
                    "status": "error",
                    "message": "No clinic and personData saved"
                });
            }

            return res.status(200).json({
                "status": "success",
                "message": "Clinic and PersonData registered",
                "clinicPersonData": clinicPersonDataStored
            });
        } catch (error) {
            return res.status(500).json({
                "status": "error",
                "message": "Error while saving clinic and personData",
                error
            });
        }
    } catch {
        return res.status(500).json({
            "status": "error",
            "message": "Error while finding clinic and personData duplicate"
        });
    }
}

const list = (req, res) => {
    ClinicPersonData.find().populate(["clinic", "personData"]).sort('_id').then(clinicsPersonData => {
        if (!clinicsPersonData) {
            return res.status(404).json({
                status: "Error",
                message: "No clinics and personData avaliable..."
            });
        }

        return res.status(200).json({
            "status": "success",
            clinicsPersonData
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const searchClinicPersonDataByDni = async (req, res) => {
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

    ClinicPersonData.find({ clinic: clinicId }).populate({ path: "personData", match: { dni: req.query.dni } }).sort('_id').then(clinicPersonData => {
        clinicPersonData = clinicPersonData.filter(clinicPersonData => clinicPersonData.personData);
        
        if (clinicPersonData.length == 0) {
            return res.status(404).json({
                status: "Error",
                message: "No existe data de la persona en la clinica"
            });
        }

        return res.status(200).json({
            "status": "success",
            clinicPersonData
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

    CampusesDoctors.find().populate([{ path: "doctor", populate: { path: "personData" } }, { path: "campus", populate: { path: "user", match: { _id: userId } } }]).sort('_id').then(campusesDoctors => {
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
    createFromCampus,
    list,
    searchClinicPersonDataByDni,
    getByCampusId,
    getByMyCampus,
    searchDoctorsByMyCampus,
    getByDoctorId,
    deleteByDoctorId
}