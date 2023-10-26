module.exports = (io) => {
    io.on('connection', (socket) => {
        io.emit('connectionSatisfactory');

        socket.on('doctorDeletedCampusInterface', (arg) => {
            io.emit('deletedDoctorInCampus', arg);
            io.emit('deletedDoctorInCampusForDoctorsView', arg.validator);
            io.emit('deletedDoctorInCampusForDoctorProfileView', arg.validator);
        });

        socket.on('patientDeletedCampusInterface', (arg) => {
            io.emit('deletedPatientInCampus', arg);
            io.emit('deletedPatientInCampusForPatientsView', arg.validator);
            io.emit('deletedPatientInCampusForPatientProfileView', arg.validator);
        });

        socket.on('patientCreatedCampusInterface', (arg) => {
            io.emit('createdPatientInCampus', arg);
            io.emit('createdPatientInCampusForPatientsView', arg.validator);
        });

        socket.on('doctorCreatedCampusInterface', (arg) => {
            io.emit('createdDoctorInCampus', arg);
            io.emit('createdDoctorInCampusForDoctorsView', arg.validator);
        });

        socket.on('consultationResultCreatedCampusInterface', (arg) => {
            io.emit('createdConsultationResultInCampus', arg);
            io.emit('createdConsultationResultInCampusForConsultationView', arg.validator);
        });

        socket.on('consultationCreatedCampusInterface', (arg) => {
            io.emit('createdConsultationInCampus', arg);
            io.emit('createdConsultationInCampusForPatientProfileView', arg.validator);
            io.emit('createdConsultationInCampusForDoctorProfileView', arg.validator);
            io.emit('createdConsultationInCampusForAgendaView', arg.validatorCampus);
            io.emit('createdConsultationInCampusForHistoryView', arg.validatorCampus);
        });

        socket.on('treatmentDetailCreatedCampusInterface', (arg) => {
            io.emit('createdTreatmentDetailInCampus', arg);
            io.emit('createdTreatmentDetailInCampusForTreatmentDetailView', arg.validator);
        });

        socket.on('treatmentAppointmentCreatedCampusInterface', (arg) => {
            io.emit('createdTreatmentAppointmentInCampus', arg);
            io.emit('createdTreatmentAppointmentInCampusForTreatmentDetailView', arg.validator);
            io.emit('createdTreatmentAppointmentInCampusForPatientProfileView', arg.validator);
            io.emit('createdTreatmentAppointmentInCampusForDoctorProfileView', arg.validator);
            io.emit('createdTreatmentAppointmentInCampusForAgendaView', arg.validatorCampus);
            io.emit('createdTreatmentAppointmentInCampusForHistoryView', arg.validatorCampus);
        });

        //socket.on('closedAgendaCampusInterface', () => {

        //})
    });
}