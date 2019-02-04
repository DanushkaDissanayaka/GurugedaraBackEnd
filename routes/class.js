const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/jwt');
const database = require('../databaseHandle/connectDatabase');

router.get("/getClassDetails", function (req, res, next) {
    database.getClassDetails(function (err, result) {
        if (err) {
            res.json({ success: false, massage: "Error something wrong" });
        }
        else {
            res.json({ success: true, data: result });
        }
    });
});

router.post("/getclassDetailsFromStudentId", function (req, res, next) {
    const userId = req.body.userId
    database.getSutudentEnrolledClass(userId, function (err, result) {
        if (err) {
            res.json({ success: false, massage: "Error something wrong" });
        }
        else {
            res.json({ success: true, data: result });
        }
    });
});



router.post('/enrol', function (req, res, next) {
    const data = [
        req.body.userId,
        req.body.classId
    ]
    database.enrolStudents(data, function (err, result) {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: "Error something wrong" });
        }
        else {
            res.json({ success: true, msg: 'Student enrolment success' });
        }
    });

});


router.post('/unenrol', function (req, res, next) {

    const userId = req.body.userId
    const classID = req.body.classId

    database.unEnrolStudents(userId,classID, function (err, result) {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: "Error something wrong" });
        }
        else {
            res.json({ success: true, msg: 'Student Remove from Class success' });
        }
    });

});

router.post('/addClasses', function (req, res, next) {
    const data = [
        req.body.ClassID,
        req.body.subjectID,
        req.body.locationID,
        req.body.teacherID,
        req.body.dateOfWeek,
        req.body.halfFee,
        req.body.fullFee,
        req.body.startTime,
        req.body.endTime,
        req.body.description,
        req.body.Title
    ]
    database.addNewClass(data, function (err, result) {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: "Error something wrong" });
        }
        else {
            res.json({ success: true, msg: 'Class Added' });
        }
    });
});

router.post("/deleteClass", function (req, res, next) {
    const classID = req.body.ClassID;
    database.deleteClasse(classID, function (err, result) {
        if (err) {
            res.json({ success: false, massage: "Error something wrong" });
        }
        else {
            res.json({ success: true, msg: 'Class Deleted' });
        }
    });
});

router.post("/getAllstudentDetailsOfAclass", function (req, res, next) {
    const classID = req.body.ClassID;
    database.getAllClassStudentDetailsOfaClass(classID, function (err, result) {
        if (err) {
            console.log(err);

            res.json({ success: false, massage: "Error something wrong" });
        }
        else {
            res.json({ success: true, data: result });
        }
    });
});

router.post("/ClassTitle", function (req, res, next) {
    const teacherId = req.body.userId;
    database.getClassTItleFromTeacherId(teacherId, function (err, result) {
        if (err) {
            console.log(err);

            res.json({ success: false, massage: "Error something wrong" });
        }
        else {
            res.json({ success: true, data: result });
        }
    });
});
module.exports = router;