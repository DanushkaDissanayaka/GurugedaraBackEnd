const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/jwt');
const database = require('../databaseHandle/connectDatabase');
const moment = require('moment');
const momentTz = require('moment-timezone');

router.post('/addMarks', function (req, res, next) {
    const data = req.body.marks;
    console.log(data);
    database.addMarks(data, function (err, result) {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: "Error something wrong" });
        }
        else {
            res.json({ success: true, msg: 'successfuly aded' });
        }
    })
});


router.post("/updateMarks", function (req, res, next) {
    const mark = req.body.mark;
    const id = req.body.markId;

    data = [mark,id]
    database.updateMark(id, mark, function (err, result) {
        if (err) {
            console.log(err);
            res.json({ success: false, massage: "Error something wrong" });
        }
        else {
            res.json({ success: true, massage: "Recor Updated" });
        }
    });
});

router.post("/getmarksStudent", function (req, res, next) {
    const UserId = req.body.UserId;
    const classID = req.body.ClassId;
    const month = req.body.month;
    const year = req.body.year;
    database.getMarkstudent(month, year, classID, UserId, function (err, result) {
        if (err) {
            console.log(err);
            res.json({ success: false, massage: "Error something wrong" });
        }
        else {
            for (let index = 0; index < result.length; index++) {
                result[index].atDate = moment(result[index].atDate).format("YYYY-MM-DD");
            }
            res.json({ success: true, data: result });
        }
    });
});

router.post("/getMarkTeacher", function (req, res, next) {
    const classID = req.body.ClassId;
    const month = req.body.month;
    const year = req.body.year;
    database.getMarkTeacher(month, year, classID, function (err, result) {
        if (err) {
            console.log(err);
            res.json({ success: false, massage: "Error something wrong" });
        }
        else {
            for (let index = 0; index < result.length; index++) {
                result[index].atDate = moment(result[index].atDate).format("YYYY-MM-DD");
            }
            res.json({ success: true, data: result });
        }
    });
});

module.exports = router;