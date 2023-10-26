const Consultation = require("../models/consultationModel");
const TreatmentAppointment = require("../models/treatmentAppointmentsModel");
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const getAgendaBySede = async (req, res) => {
    let userId = new ObjectId(req.user.id);
    let today = new Date().setHours(0,0,0,0);
    let agenda = [];

    let consultations = await Consultation.find({ status: "Scheduled"}).populate([{ path: "patient", populate: { path: "personData" } }, { path: "doctor", populate: { path: "personData" } }, { path: "campus", populate: { path: "user", match: { _id: userId } } }]).sort('hour');
    consultations.forEach(consultation => {
        const consultationDate = new Date(consultation.date).setHours(0,0,0,0);
        const consultationToday = consultationDate == today;

        if (consultation.campus.user && consultationToday) {
            agenda.push({ 
                fullNameDoctor: consultation.doctor.personData.names + ' ' + consultation.doctor.personData.fatherLastName + ' ' + consultation.doctor.personData.motherLastName,
                fullNamePatient: consultation.patient.personData.names + ' ' + consultation.patient.personData.fatherLastName + ' ' + consultation.patient.personData.motherLastName,
                hour: consultation.hour,
                typeEvent: "Consulta",
                _id: consultation._id,
                treatmentDetailId: "No"
            });
        }
    });

    let treatmentAppointments = await TreatmentAppointment.find({ status: "Scheduled"}).populate([{ path: "doctor", populate: { path: "personData" } }, { path: "campus", populate: { path: "user", match: { _id: userId } } }, { path: "treatmentDetail", populate: { path: "patient", populate: { path: "personData" } } } ]).sort('hour');
    treatmentAppointments.forEach(treatmentAppointment => {
        const treatmentAppointmentDate = new Date(treatmentAppointment.date).setHours(0,0,0,0);
        const treatmentAppointmentToday = treatmentAppointmentDate == today;

        if (treatmentAppointment.campus.user && treatmentAppointmentToday) {
            agenda.push({
                fullNameDoctor: treatmentAppointment.doctor.personData.names + ' ' + treatmentAppointment.doctor.personData.fatherLastName + ' ' + treatmentAppointment.doctor.personData.motherLastName,
                fullNamePatient: treatmentAppointment.treatmentDetail.patient.personData.names + ' ' + treatmentAppointment.treatmentDetail.patient.personData.fatherLastName + ' ' + treatmentAppointment.treatmentDetail.patient.personData.motherLastName,
                hour: treatmentAppointment.hour,
                typeEvent: "Cita",
                _id: treatmentAppointment._id,
                treatmentDetailId: treatmentAppointment.treatmentDetail._id
            })
        }
    });

    if (agenda.length == 0) {
        return res.status(404).json({
            status: "Error",
            message: "Citas y consultas no encontradas en agenda para el dia de hoy"
        });
    }

    return res.status(200).json({
        "status": "success",
        agenda
    });
}

const getHistoryBySede = async (req, res) => {
    let userId = new ObjectId(req.user.id);
    let agenda = [];

    let consultations = await Consultation.find().populate([{ path: "patient", populate: { path: "personData" } }, { path: "doctor", populate: { path: "personData" } }, { path: "campus", populate: { path: "user", match: { _id: userId } } }]).sort([['date', -1], ['hour', 1]]);
    consultations.forEach(consultation => {
        if (consultation.campus.user) {
            agenda.push({ 
                fullNameDoctor: consultation.doctor.personData.names + ' ' + consultation.doctor.personData.fatherLastName + ' ' + consultation.doctor.personData.motherLastName,
                fullNamePatient: consultation.patient.personData.names + ' ' + consultation.patient.personData.fatherLastName + ' ' + consultation.patient.personData.motherLastName,
                hour: consultation.hour,
                date: consultation.date,
                typeEvent: "Consulta",
                _id: consultation._id,
                treatmentDetailId: "No"
            });
        }
    });

    let treatmentAppointments = await TreatmentAppointment.find().populate([{ path: "doctor", populate: { path: "personData" } }, { path: "campus", populate: { path: "user", match: { _id: userId } } }, { path: "treatmentDetail", populate: { path: "patient", populate: { path: "personData" } } } ]).sort([['date', -1], ['hour', 1]]);
    treatmentAppointments.forEach(treatmentAppointment => {
        if (treatmentAppointment.campus.user) {
            agenda.push({
                fullNameDoctor: treatmentAppointment.doctor.personData.names + ' ' + treatmentAppointment.doctor.personData.fatherLastName + ' ' + treatmentAppointment.doctor.personData.motherLastName,
                fullNamePatient: treatmentAppointment.treatmentDetail.patient.personData.names + ' ' + treatmentAppointment.treatmentDetail.patient.personData.fatherLastName + ' ' + treatmentAppointment.treatmentDetail.patient.personData.motherLastName,
                hour: treatmentAppointment.hour,
                date: treatmentAppointment.date,
                typeEvent: "Cita",
                _id: treatmentAppointment._id,
                treatmentDetailId: treatmentAppointment.treatmentDetail._id
            })
        }
    });

    if (agenda.length == 0) {
        return res.status(404).json({
            status: "Error",
            message: "Citas y consultas no encontradas para sede"
        });
    }

    return res.status(200).json({
        "status": "success",
        agenda
    });
}

module.exports = {
    getAgendaBySede,
    getHistoryBySede
}