const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/jwt');
const database = require('../databaseHandle/connectDatabase');


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
            console.log(err);        }
        else {
            res.json({ success: true, msg: "Fee Added" })
        }
    });
});


router.post("/getFeeStudent",function(req,res,next){
    const UserId = req.body.UserId;
    const classID = req.body.ClassId;
    database.getAttendancestudent(UserId,classID, function(err,result){
        if(err){
            console.log(err);
            res.json({success : false , massage : "Error something wrong"});
        }
        else{
            res.json({success : true , data : result});
        }
    });
});

router.post("/getFeeTeacher",function(req,res,next){
    const classID = req.body.ClassId;
    database.getAttendanceTeacher(classID , function(err,result){
        if(err){
            console.log(err);
            res.json({success : false , massage : "Error something wrong"});
        }
        else{
            res.json({success : true , data : result});
        }
    });
});

module.exports = router;