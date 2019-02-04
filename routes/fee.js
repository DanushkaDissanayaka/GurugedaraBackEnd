const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/jwt');
const database = require('../databaseHandle/connectDatabase');
const moment = require('moment');
const momentTz = require('moment-timezone');


router.post("/addFee", function (req, res, next) {
    const StudentId = req.body.StudentId
    const OfficeuserId = req.body.OfficeuserId
    const ClassId = req.body.ClassId
    const atDate = req.body.atDate
    const amount = req.body.amount

    const feeData = [StudentId, OfficeuserId, ClassId, atDate, amount]

    database.addFeerecord(feeData, function (err, result) {
        if (err) {
            res.json({ success: false, msg: "Something went wrong" })
            console.log(err);
        }
        else {
            res.json({ success: true, msg: "Fee Added" })
        }
    });
});


//Need to se multiple  update record find it need to update ClassID and Amount of Fee
router.post("/updateFee", function (req, res, next) {
    const fee = req.body.amount;
    const id = req.body.feeId;
    const classId = req.body.classId

    const data = [classId,fee,id]

    database.updateFee(data, function (err, result) {
        if (err) {
            console.log(err);
            res.json({ success: false, massage: "Error something wrong" });
        }
        else {
            res.json({ success: true, massage:"Recor Updated" });
        }
    });
});


router.post("/getFeeStudent", function (req, res, next) {

    const UserId = req.body.UserId;
    const classID = req.body.ClassId;
    const year = req.body.year;

    database.getFeerecordstudent(year, classID, UserId, function (err, result) {
        if (err) {
            console.log(err);
            res.json({ success: false, massage: "Error something wrong" });
        }
        else {
            for (let index = 0; index < result.length; index++) {
                result[index].atDate = moment(result[index].atDate).format("YYYY-MM-DD");
                result[index].atTime = moment(result[index].atTime).format("YYYY-MM-DD HH:MM");
            }
            res.json({ success: true, data: result });
        }
    });
});

router.post("/getFeeTeacher", function (req, res, next) {
    const classID = req.body.ClassId;
    const month = req.body.month;
    const year = req.body.year;
    database.getFeerecordTeacher(month, year, classID, function (err, result) {
        if (err) {
            console.log(err);
            res.json({ success: false, massage: "Error something wrong" });
        }
        else {
            for (let index = 0; index < result.length; index++) {
                result[index].atDate = moment(result[index].atDate).format("YYYY-MM-DD");
                result[index].atTime = moment(result[index].atTime).format("YYYY-MM-DD HH:MM");
            }
            res.json({ success: true, data: result });
        }
    });
});
module.exports = router;