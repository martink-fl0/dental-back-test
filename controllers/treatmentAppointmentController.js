const TreatmentAppointment = require("../models/treatmentAppointmentsModel");
const Campus = require("../models/campusModel");
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const middlewareService = require("../services/group");

const create = async (req, res) => {
    let body = req.body;
    let treatmentDetailId = req.query.idTreatmentDetail;
    let doctorId = req.query.idDoctor;
    let campusId = req.query.idCampus;

    if (!body.description || !body.hour || !body.cost || !body.date) {
        return res.status(400).json({
            "status": "error",
            "message": "Missing data"
        });
    }

    let bodyTreatmentAppointment = {
        treatmentDetail: treatmentDetailId,
        description: body.description,
        date: body.date,
        status: "Scheduled",
        hour: body.hour,
        cost: body.cost,
        doctor: doctorId,
        campus: campusId
    }

    let treatment_appointment_to_save = new TreatmentAppointment(bodyTreatmentAppointment);

    try {
        const treatmentAppointmentStored = await treatment_appointment_to_save.save();

        if (!treatmentAppointmentStored) {
            return res.status(500).json({
                "status": "error",
                "message": "No treatmentAppointment saved"
            });
        }

        const populatedTreatmentAppointment = await TreatmentAppointment.findById(treatmentAppointmentStored._id).populate([{ path: "doctor", populate: { path: "personData" } }, { path: "campus", populate: [{ path: "clinic", populate: { path: "user" } }, "user"] }, { path: "treatmentDetail", populate: [{ path: "patient", populate: { path: "personData" } }, { path: "consultationResult", populate: { path: "treatment" } }] } ]);

        return res.status(200).json({
            "status": "success",
            "message": "Treatment appointment registered",
            "treatmentAppointment": populatedTreatmentAppointment
        });
    } catch (error) {
        return res.status(500).json({
            "status": "error",
            "message": "Error while saving treatment appointment",
            error
        });
    }
}

const list = (req, res) => {
    TreatmentAppointment.find().populate("treatmentDetail").sort('_id').then(treatmentAppointments => {
        if (!treatmentAppointments) {
            return res.status(404).json({
                status: "Error",
                message: "No treatmentAppointments avaliable..."
            });
        }

        return res.status(200).json({
            "status": "success",
            treatmentAppointments
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const treatmentAppointmentById = (req, res) => {
    TreatmentAppointment.findById(req.query.idTreatmentAppointments).populate("doctor campus").then(treatmentAppointment => {
        if (!treatmentAppointment) {
            return res.status(404).json({
                "status": "error",
                "message": "Treatment appointment doesn't exist"
            });
        }

        return res.status(200).json({
            "status": "success",
            "treatmentAppointment": treatmentAppointment
        });
    }).catch(() => {
        return res.status(404).json({
            "status": "error",
            "message": "Error while finding treatmentAppointment"
        });
    });
}

const getByTreatmentDetailId = (req, res) => {
    let treatmentDetailId = req.query.idTreatmentDetail;

    TreatmentAppointment.find({ treatmentDetail: treatmentDetailId }).populate([{ path: "doctor", populate: { path: "personData" } }, "campus" ] ).sort('_id').then(treatmentAppointments => {
        if (treatmentAppointments.length == 0) {
            return res.status(404).json({
                status: "Error",
                message: "Citas de tratamiento no encontradas"
            });
        }

        return res.status(200).json({
            "status": "success",
            treatmentAppointments
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const getByPatientId = async (req, res) => {
    let patientId = new ObjectId(req.query.idPatient);
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

    TreatmentAppointment.find({ campus: campusId }).populate([{ path: "doctor", populate: { path: "personData" } }, "campus", { path: "treatmentDetail", populate: [{ path: "consultationResult", populate: "treatment" }, { path: "patient", match: { _id: patientId } }] } ]).sort('_id').then(treatmentAppointments => {
        treatmentAppointments = treatmentAppointments.filter(treatmentAppointment => treatmentAppointment.treatmentDetail.patient);
        
        if (treatmentAppointments.length == 0) {
            return res.status(404).json({
                status: "Error",
                message: "Citas de tratamiento no encontradas"
            });
        }

        const groupedAppointments = middlewareService.groupByTreatmentDetail(treatmentAppointments);

        return res.status(200).json({
            "status": "success",
            groupedAppointments
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const getByDoctorId = async (req, res) => {
    let doctorId = new ObjectId(req.query.idDoctor);
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

    TreatmentAppointment.find({ campus: campusId }).populate([{ path: "doctor", match: { _id: doctorId }, populate: { path: "personData"} }, "campus", { path: "treatmentDetail", populate: [{ path: "consultationResult", populate: "treatment" }, { path: "patient", populate: "personData" }] } ]).sort('_id').then(treatmentAppointments => {
        treatmentAppointments = treatmentAppointments.filter(treatmentAppointment => treatmentAppointment.doctor);
        
        if (treatmentAppointments.length == 0) {
            return res.status(404).json({
                status: "Error",
                message: "Citas de tratamiento no encontradas"
            });
        }

        const groupedAppointments = middlewareService.groupByTreatmentDetail(treatmentAppointments);

        return res.status(200).json({
            "status": "success",
            groupedAppointments
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const getDoctorsAppointmentsGroupedByCampusToken = async (req, res) => {
    let userId = req.user.id;
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

    TreatmentAppointment.find().populate([{ path: "doctor", populate: { path: "personData"} }, { path: "campus", populate: { path: "clinic", populate: { path: "user", match: { _id: clinicUserId } } } }, { path: "treatmentDetail", populate: [{ path: "consultationResult", populate: "treatment" }, { path: "patient", populate: "personData" }] } ]).sort('_id').then(treatmentAppointments => {
        treatmentAppointments = treatmentAppointments.filter(treatmentAppointment => treatmentAppointment.campus.clinic.user);
        if (treatmentAppointments.length == 0) {
            return res.status(404).json({
                status: "Error",
                message: "Citas de tratamiento no encontradas"
            });
        }

        const groupedAppointments = middlewareService.groupDoctorsAppointmentByTreatmentDetail(treatmentAppointments);

        return res.status(200).json({
            "status": "success",
            groupedAppointments
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const getPatientsAppointmentsGroupedByCampusToken = async (req, res) => {
    let userId = req.user.id;
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

    TreatmentAppointment.find().populate([{ path: "doctor", populate: { path: "personData"} }, { path: "campus", populate: { path: "clinic", populate: { path: "user", match: { _id: clinicUserId } } } }, { path: "treatmentDetail", populate: [{ path: "consultationResult", populate: "treatment" }, { path: "patient", populate: "personData" }] } ]).sort('_id').then(treatmentAppointments => {
        treatmentAppointments = treatmentAppointments.filter(treatmentAppointment => treatmentAppointment.campus.clinic.user);

        if (treatmentAppointments.length == 0) {
            return res.status(404).json({
                status: "Error",
                message: "Citas de tratamiento no encontradas"
            });
        }

        const groupedAppointments = middlewareService.groupPatientsAppointmentByTreatmentDetail(treatmentAppointments);

        return res.status(200).json({
            "status": "success",
            groupedAppointments
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const myTreatmentAppointmentsByCampus = async (req, res) => {
    let userId = new ObjectId(req.user.id);

    TreatmentAppointment.find().populate([{ path: "doctor", populate: { path: "personData" } }, { path: "campus", populate: { path: "user", match: { _id: userId } } }, { path: "treatmentDetail", populate: { path: "patient", populate: { path: "personData" } } } ]).sort('hourScheduled').then(treatmentAppointments => {
        treatmentAppointments = treatmentAppointments.filter(treatmentAppointment => treatmentAppointment.campus.user);
        
        if (treatmentAppointments.length == 0) {
            return res.status(404).json({
                status: "Error",
                message: "Citas no encontradas"
            });
        }

        return res.status(200).json({
            "status": "success",
            treatmentAppointments
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const myTreatmentAppointmentsClinicByCampus = async (req, res) => {
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

    TreatmentAppointment.find().populate([{ path: "doctor", populate: { path: "personData" } }, { path: "campus", populate: { path: "clinic", populate: { path: "user", match: { _id: clinicUserId } } } }, { path: "treatmentDetail", populate: { path: "patient", populate: { path: "personData" } } } ]).sort('hourScheduled').then(treatmentAppointments => {
        treatmentAppointments = treatmentAppointments.filter(treatmentAppointment => treatmentAppointment.campus.clinic.user);
        
        if (treatmentAppointments.length == 0) {
            return res.status(404).json({
                status: "Error",
                message: "Citas no encontradas"
            });
        }

        return res.status(200).json({
            "status": "success",
            treatmentAppointments
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const myTreatmentAppointmentsByCampusForAgenda = (req, res) => {
    let userId = new ObjectId(req.user.id);
    let today = new Date().setHours(0,0,0,0);

    TreatmentAppointment.find({ status: "Scheduled"}).populate([{ path: "doctor", populate: { path: "personData" } }, { path: "campus", populate: { path: "user", match: { _id: userId } } }, { path: "treatmentDetail", populate: { path: "patient", populate: { path: "personData" } } } ]).sort('hour').then(treatmentAppointments => {
        treatmentAppointments = treatmentAppointments.filter(treatmentAppointment => {
            const treatmentAppointmentDate = new Date(treatmentAppointment.date).setHours(0,0,0,0);
            const treatmentAppointmentToday = treatmentAppointmentDate == today;
            
            return treatmentAppointment.campus.user && treatmentAppointmentToday;
        });
        
        if (treatmentAppointments.length == 0) {
            return res.status(404).json({
                status: "Error",
                message: "Citas no encontradas"
            });
        }

        return res.status(200).json({
            "status": "success",
            treatmentAppointments
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const editTreatmentAppointment = (req, res) => {
    let id = req.query.idTreatmentAppointment;

    TreatmentAppointment.findOneAndUpdate({ _id: id }, req.body, { new: true }).then(treatmentAppointmentUpdated => {
        if (!treatmentAppointmentUpdated) {
            return res.status(404).json({
                status: "error",
                mensaje: "Treatment Appointment not found"
            });
        }
        return res.status(200).send({
            status: "success",
            treatmentAppointment: treatmentAppointmentUpdated
        });
    }).catch(() => {
        return res.status(404).json({
            status: "error",
            mensaje: "Error while finding and updating treatment appointment"
        });
    });
}

module.exports = {
    create,
    list,
    treatmentAppointmentById,
    getByTreatmentDetailId,
    getByPatientId,
    getByDoctorId,
    getDoctorsAppointmentsGroupedByCampusToken,
    getPatientsAppointmentsGroupedByCampusToken,
    myTreatmentAppointmentsByCampus,
    myTreatmentAppointmentsClinicByCampus,
    myTreatmentAppointmentsByCampusForAgenda,
    editTreatmentAppointment
}