const Doctor = require("../models/doctorModel");

const create = async (req, res) => {
    let body = req.body;
    let userId = req.user.id;
    let personDataId = req.query.idPersonData;
    let specialityId = req.query.idSpeciality;

    if (!body.tuitionNumber) {
        return res.status(400).json({
            "status": "error",
            "message": "Missing data"
        });
    }

    let bodyDoctor = {
        personData: personDataId,
        tuitionNumber: body.tuitionNumber,
        speciality: specialityId,
        user: userId
    }

    try {
        const doctors = await Doctor.find({ $or: [{ tuitionNumber: bodyDoctor.tuitionNumber.toLowerCase() }] });

        if (doctors && doctors.length >= 1) {
            return res.status(200).json({
                "status": "success",
                "message": "The doctor already exists"
            });
        }

        let doctor_to_save = new Doctor(bodyDoctor);

        try {
            const doctorStored = await doctor_to_save.save();

            if (!doctorStored) {
                return res.status(500).json({
                    "status": "error",
                    "message": "No doctor saved"
                });
            }

            return res.status(200).json({
                "status": "success",
                "message": "Doctor registered",
                "doctor": doctorStored
            });
        } catch (error) {
            return res.status(500).json({
                "status": "error",
                "message": "Error while saving doctor",
                error
            });
        }
    } catch {
        return res.status(500).json({
            "status": "error",
            "message": "Error while finding doctor duplicate"
        });
    }
}

const createWithoutUser = async (req, res) => {
    let body = req.body;
    let personDataId = req.query.idPersonData;
    let specialityId = req.query.idSpeciality;

    if (!body.tuitionNumber) {
        return res.status(400).json({
            "status": "error",
            "message": "Faltan datos de doctor"
        });
    }

    let bodyDoctor = {
        personData: personDataId,
        tuitionNumber: body.tuitionNumber,
        speciality: specialityId
    }

    let doctor_to_save = new Doctor(bodyDoctor);

    try {
        const doctorStored = await doctor_to_save.save();

        if (!doctorStored) {
            return res.status(500).json({
                "status": "error",
                "message": "No doctor saved"
            });
        }

        return res.status(200).json(doctorStored);
    } catch (error) {
        return res.status(500).json({
            "status": "error",
            "message": "Error while saving doctor",
            error
        });
    }
}

const myDoctor = (req, res) => {
    let userId = req.user.id;

    Doctor.find({ user: userId }).populate("personData speciality").then(doctor => {
        if (!doctor) {
            return res.status(404).json({
                status: "Error",
                message: "No doctor avaliable..."
            });
        }

        return res.status(200).json({
            "status": "success",
            doctor
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const list = (req, res) => {
    Doctor.find().populate("personData speciality").sort('_id').then(doctors => {
        if (!doctors) {
            return res.status(404).json({
                status: "Error",
                message: "No doctors avaliable..."
            });
        }

        return res.status(200).json({
            "status": "success",
            doctors
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const doctorById = (req, res) => {
    Doctor.findById(req.query.idDoctor).populate(["personData", "speciality"]).then(doctor => {
        if (!doctor) {
            return res.status(404).json({
                "status": "error",
                "message": "Doctor doesn't exist"
            });
        }

        return res.status(200).json({
            "status": "success",
            "doctor": doctor
        });
    }).catch(() => {
        return res.status(404).json({
            "status": "error",
            "message": "Error while finding doctor"
        });
    });
}

const searchDoctorByPersonDataId = (req, res) => {
    Doctor.find({ personData: req.query.personDataId }).populate().then(doctors => {
        doctors = doctors.filter(doctor => doctor.personData);

        if (!doctors || doctors.length == 0) {
            return res.status(404).json({
                "status": "error",
                "message": "Doctor no existe"
            });
        }

        return res.status(200).json({
            "status": "success",
            "doctor": doctors
        });
    }).catch(() => {
        return res.status(404).json({
            "status": "error",
            "message": "Error while finding doctor"
        });
    });
}

module.exports = {
    create,
    createWithoutUser,
    myDoctor,
    list,
    doctorById,
    searchDoctorByPersonDataId
}