const { connection } = require("./database/connection");
const express = require("express");
const cors = require("cors");
const http = require('http');
const socketIo = require('socket.io');

console.log("Dental backend api started");

const uri = process.env.MONGO_URI || "mongodb+srv://joserodrigolopez:xK22YDi1adZJdw25@mongodbdeployed.nr8iyxd.mongodb.net/dental_back";

connection(uri);

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const UserRoutes = require("./routes/userRoutes");
const ClinicRoutes = require("./routes/clinicRoutes");
const PersonDataRoutes = require("./routes/personDataRoutes");
const CampusRoutes = require("./routes/campusRoutes");
const SpecialityRoutes = require("./routes/specialityRoutes");
const DoctorRoutes = require("./routes/doctorRoutes");
const CampusDoctorRoutes = require("./routes/campusDoctorRoutes");
const CampusPatientRoutes = require("./routes/campusPatientRoutes");
const PatientsRoutes = require("./routes/patientRoutes");
const ConsultationRoutes = require("./routes/consultationRoutes");
const ConsultationResultRoutes = require("./routes/consultationResultRoutes");
const TreatmentRoutes = require("./routes/treatmentRoutes");
const TreatmentDetailRoutes = require("./routes/treatmentDetailRoutes");
const TreatmentAppointmentRoutes = require("./routes/treatmentAppointmentRoutes");
const AgendaRoutes = require("./routes/agendaRoutes");
const ClinicPersonDataRoutes = require("./routes/clinicPersonDataRoutes");
app.use("/api/users", UserRoutes);
app.use("/api/clinics", ClinicRoutes);
app.use("/api/personData", PersonDataRoutes);
app.use("/api/campuses", CampusRoutes);
app.use("/api/specialities", SpecialityRoutes);
app.use("/api/doctors", DoctorRoutes);
app.use("/api/campusesdoctors", CampusDoctorRoutes);
app.use("/api/campusespatients", CampusPatientRoutes);
app.use("/api/patients", PatientsRoutes);
app.use("/api/consultations", ConsultationRoutes);
app.use("/api/consultationResults", ConsultationResultRoutes);
app.use("/api/treatments", TreatmentRoutes);
app.use("/api/treatmentDetails", TreatmentDetailRoutes);
app.use("/api/treatmentAppointments", TreatmentAppointmentRoutes);
app.use("/api/agenda", AgendaRoutes);
app.use("/api/clinicsPersonData", ClinicPersonDataRoutes);

app.get("/test-route", (req, res) => {
    return res.status(200).json({
        "id": 1,
        "name": "Jose Lopez",
        "version": "1.0.0"
    });
});

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
      origin: ['https://dental-software-1a384.web.app', 'http://localhost:4200'],
      methods: ['GET', 'POST'],
      credentials: true,
    },
});

const requests = require('./socket-requests/requests');
requests(io);

server.listen(port, () => {
    console.log("Node server running in port:", port); 
});
