const Consultation = require("../models/consultationModel");
const Campus = require("../models/campusModel");
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const create = async (req, res) => {
    let body = req.body;
    let userId = req.user.id;
    let patientId = req.query.idPatient;
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

    if (!body.date || !body.hour) {
        return res.status(400).json({
            "status": "error",
            "message": "Faltan datos"
        });
    }

    let bodyConsultation = {
        patient: patientId,
        doctor: doctorId,
        campus: campusId,
        consultationReason: body.consultationReason,
        cost: body.cost,
        date: body.date,
        status: "Scheduled",
        hour: body.hour
    }

    let consultation_to_save = new Consultation(bodyConsultation);

    try {
        const consultationStored = await consultation_to_save.save();

        if (!consultationStored) {
            return res.status(500).json({
                "status": "error",
                "message": "No consultation saved"
            });
        }

        const populatedConsultation = await Consultation.findById(consultationStored._id).populate([{ path: "patient", populate: { path: "personData" } }, { path: "doctor", populate: { path: "personData" } }, { path: "campus", populate: [{ path: "clinic", populate: { path: "user" } }, "user"] }]);

        return res.status(200).json({
            "status": "success",
            "message": "Consultation registered",
            "consultation": populatedConsultation
        });
    } catch (error) {
        return res.status(500).json({
            "status": "error",
            "message": "Error while saving consultation",
            error
        });
    }
}

const list = (req, res) => {
    Consultation.find().populate("patient doctor campus").sort('_id').then(consultations => {
        if (!consultations) {
            return res.status(404).json({
                status: "Error",
                message: "No consultations avaliable..."
            });
        }

        return res.status(200).json({
            "status": "success",
            consultations
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const consultationById = (req, res) => {
    Consultation.findById(req.query.idConsultation).populate([{ path: "patient", populate: { path: "personData" } }, {path: "doctor", populate: { path: "personData" } } ]).then(consultation => {
        if (!consultation) {
            return res.status(404).json({
                "status": "error",
                "message": "Consultation doesn't exist"
            });
        }

        return res.status(200).json({
            "status": "success",
            "consultation": consultation
        });
    }).catch(() => {
        return res.status(404).json({
            "status": "error",
            "message": "Error while finding consultation"
        });
    });
}

const consultationByIdPatient = async (req, res) => {
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

    Consultation.find({ campus: campusId }).populate({ path: "patient", match: { _id: patientId } }).sort('startDate').then(consultations => {
        consultations = consultations.filter(consultation => consultation.patient);

        if (consultations.length == 0) {
            return res.status(404).json({
                status: "Error",
                message: "Consultas no encontradas"
            });
        }

        return res.status(200).json({
            "status": "success",
            consultations
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const consultationByIdDoctor = async (req, res) => {
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

    Consultation.find({ campus: campusId }).populate([{ path: "patient", populate: {path: "personData"}}, { path: "doctor", match: { _id: doctorId } }]).sort('startDate').then(consultations => {
        consultations = consultations.filter(consultation => consultation.doctor);
        
        if (consultations.length == 0) {
            return res.status(404).json({
                status: "Error",
                message: "Consultas no encontradas"
            });
        }

        return res.status(200).json({
            "status": "success",
            consultations
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const consultationPatientsByIdDoctor = async (req, res) => {
    let doctorId = req.query.idDoctor;
    let userId = req.user.id;
    let patients = [];
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

    Consultation.find({ campus: campusId }).populate([{ path: "patient", populate: {path: "personData"}}, { path: "doctor", match: { _id: doctorId } }]).sort('startDate').then(consultations => {
        consultations.forEach(consultation => {
            if (consultation.doctor) {
                this.patients.push(consultation.patient);
            }
        });
        
        if (patients.length == 0) {
            return res.status(404).json({
                status: "Error",
                message: "No existen consultas"
            });
        }

        const patients = Array.from(new Set(patients));

        return res.status(200).json({
            "status": "success",
            patients
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const myConsultationByPatient = (req, res) => {
    let userId = new ObjectId(req.user.id);

    Consultation.find().populate(["campus", { path: "doctor", populate: { path: "personData" } }, { path: "patient", populate: [{ path: "user", match: { _id: userId } }, { path: "personData" }] }]).then(consultations => {
        if (!consultations) {
            return res.status(404).json({
                status: "Error",
                message: "No consultation avaliable..."
            });
        }

        consultations = consultations.filter(consultation => consultation.patient.user);

        return res.status(200).json({
            "status": "success",
            consultations
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const myConsultationByDoctor = (req, res) => {
    let userId = new ObjectId(req.user.id);

    Consultation.find().populate(["campus", { path: "patient", populate: { path: "personData" } }, { path: "doctor", populate: [{ path: "user", match: { _id: userId } }, { path: "personData" }] }]).then(consultations => {
        if (!consultations) {
            return res.status(404).json({
                status: "Error",
                message: "No consultation avaliable..."
            });
        }

        consultations = consultations.filter(consultation => consultation.doctor.user);

        return res.status(200).json({
            "status": "success",
            consultations
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const myConsultationByCampus = (req, res) => {
    let userId = new ObjectId(req.user.id);

    Consultation.find().populate([{ path: "patient", populate: { path: "personData" } }, { path: "doctor", populate: { path: "personData" } }, { path: "campus", populate: { path: "user", match: { _id: userId } } }]).sort('hour').then(consultations => {
        consultations = consultations.filter(consultation => consultation.campus.user);
        
        if (consultations.length == 0) {
            return res.status(404).json({
                status: "Error",
                message: "Consultas no encontradas"
            });
        }

        return res.status(200).json({
            "status": "success",
            consultations
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const myConsultationClinicByCampus = async (req, res) => {
    let userId = new ObjectId(req.user.id);
    let clinicUserId;

    try {
        const campus = await Campus.findOne({ user: userId }).populate({ path: 'clinic', populate: { path: 'user' } });
      
        if (!campus) {
          return res.status(404).json({
            status: "Error",
            message: "No campus available..."
          });
        }
      
        clinicUserId = campus.clinic.user._id;
      
    } catch (error) {
        return res.status(500).json({
          status: "error",
          error
        });
    }

    Consultation.find().populate([{ path: "patient", populate: { path: "personData" } }, { path: "doctor", populate: { path: "personData" } }, { path: "campus", populate: { path: "clinic", populate: { path: "user", match: { _id: clinicUserId } } } }]).then(consultations => {
        consultations = consultations.filter(consultation => consultation.campus.clinic.user);
        
        if (consultations.length == 0) {
            return res.status(404).json({
                status: "Error",
                message: "Consultas no encontradas"
            });
        }

        return res.status(200).json({
            "status": "success",
            consultations
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const myConsultationByCampusForAgenda = (req, res) => {
    let userId = new ObjectId(req.user.id);
    let today = new Date().setHours(0,0,0,0);

    Consultation.find({ status: "Scheduled"}).populate([{ path: "patient", populate: { path: "personData" } }, { path: "doctor", populate: { path: "personData" } }, { path: "campus", populate: { path: "user", match: { _id: userId } } }]).sort('hour').then(consultations => {
        consultations = consultations.filter(consultation => {
            const consultationDate = new Date(consultation.date).setHours(0,0,0,0);
            const consultationToday = consultationDate == today;
            
            return consultation.campus.user && consultationToday;
        });
        
        if (consultations.length == 0) {
            return res.status(404).json({
                status: "Error",
                message: "Consultas no encontradas"
            });
        }

        return res.status(200).json({
            "status": "success",
            consultations
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const editConsultation = (req, res) => {
    let id = req.query.idConsultation;

    Consultation.findOneAndUpdate({ _id: id }, req.body, { new: true }).then(consultationUpdated => {
        if (!consultationUpdated) {
            return res.status(404).json({
                status: "error",
                mensaje: "Consultation not found"
            });
        }
        return res.status(200).send({
            status: "success",
            consultation: consultationUpdated
        });
    }).catch(() => {
        return res.status(404).json({
            status: "error",
            mensaje: "Error while finding and updating consultation"
        });
    });
}

module.exports = {
    create,
    list,
    consultationById,
    consultationByIdPatient,
    consultationByIdDoctor,
    consultationPatientsByIdDoctor,
    myConsultationByPatient,
    myConsultationByDoctor,
    myConsultationByCampus,
    myConsultationClinicByCampus,
    myConsultationByCampusForAgenda,
    editConsultation
}