const groupByTreatmentDetail = treatmentAppointments => {
    const grouped = new Map();
  
    treatmentAppointments.forEach(treatmentAppointment => {
        const treatmentDetailId = treatmentAppointment.treatmentDetail._id.toString();
    
        if (!grouped.has(treatmentDetailId)) {
        grouped.set(treatmentDetailId, []);
        }
    
        grouped.get(treatmentDetailId).push(treatmentAppointment);
    });
  
    const result = Array.from(grouped).map(([treatmentDetailId, appointments]) => {
        const treatment = appointments[0].treatmentDetail.consultationResult.treatment.name;
        const treatmentId = appointments[0].treatmentDetail._id;
        return {
            treatment: treatment,
            treatmentId: treatmentId,
            appointments: appointments,
        };
    });
    
    return result;
}

const groupDoctorsAppointmentByTreatmentDetail = treatmentAppointments => {
    const grouped = new Map();
  
    treatmentAppointments.forEach(treatmentAppointment => {
        const treatmentDetailId = treatmentAppointment.treatmentDetail._id.toString();
        const doctorId = treatmentAppointment.doctor._id.toString();

        const groupKey = `${treatmentDetailId}_${doctorId}`;
    
        if (!grouped.has(groupKey)) {
        grouped.set(groupKey, []);
        }
    
        grouped.get(groupKey).push(treatmentAppointment);
    });
  
    const result = Array.from(grouped).map(([groupKey, appointments]) => {
        const treatment = appointments[0].treatmentDetail.consultationResult.treatment.name;
        const [treatmentDetailId, doctorId] = groupKey.split('_');
        return {
            treatment: treatment,
            treatmentId: treatmentDetailId,
            doctorId: doctorId,
            appointments: appointments,
        };
    });
    
    return result;
}

const groupPatientsAppointmentByTreatmentDetail = treatmentAppointments => {
    const grouped = new Map();
  
    treatmentAppointments.forEach(treatmentAppointment => {
        const treatmentDetailId = treatmentAppointment.treatmentDetail._id.toString();
        const patientId = treatmentAppointment.treatmentDetail.patient._id.toString();

        const groupKey = `${treatmentDetailId}_${patientId}`;
    
        if (!grouped.has(groupKey)) {
        grouped.set(groupKey, []);
        }
    
        grouped.get(groupKey).push(treatmentAppointment);
    });
  
    const result = Array.from(grouped).map(([groupKey, appointments]) => {
        const treatment = appointments[0].treatmentDetail.consultationResult.treatment.name;
        const [treatmentDetailId, patientId] = groupKey.split('_');
        return {
            treatment: treatment,
            treatmentId: treatmentDetailId,
            patientId: patientId,
            appointments: appointments,
        };
    });
    
    return result;
}

module.exports = {
    groupByTreatmentDetail,
    groupDoctorsAppointmentByTreatmentDetail,
    groupPatientsAppointmentByTreatmentDetail
}