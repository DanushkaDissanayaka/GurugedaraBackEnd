const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/jwt');
const database = require('../databaseHandle/connectDatabase');
const moment = require('moment');
const momentTz = require('moment-timezone');

router.post('/getNotification', function (req, res, next) {
    const userId = req.body.userId
    const role = req.body.role
    if(role == "student"){
        database.getNotification(userId,function (err, result) {
            if (err) {
                console.log(err);
                res.json({ success: false, msg: 'Something went wrong' });
            }
            else {
                for (let index = 0; index < result.length; index++) {
                    result[index].atDate = moment(result[index].atDate).format("YYYY-MM-DD");
                }
                res.json({ success: true, data:result });
            }
        });
        return;
    }
    else if (role == "teacher"){
        database.getNotificationTeachers(userId,function (err, result) {
            if (err) {
                console.log(err);
                res.json({ success: false, msg: 'Something went wrong' });
            }
            else {
                for (let index = 0; index < result.length; index++) {
                    result[index].atDate = moment(result[index].atDate).format("YYYY-MM-DD");
                }
                res.json({ success: true, data:result });
            }
        });
        return;
    }
    else if (role == "gurdian"){
        return;
    }
    else if (role == "admin"){
        res.json({success:false , msg : "Unothorize atemp"})
        return;
    }
    else{
        res.json({success:false , msg : "Unothorize atemp"})
        return;
    }
});

router.post('/addNotification', function (req, res, next) {
    const today = momentTz.tz(new Date(), "Asia/Colombo");
    // const today = momentTz("2013-11-18 07:55");
    const UserId = req.body.UserId
    const ClassID = req.body.ClassID
    const atDate = moment(today).format("YYYY-MM-DD");
    const atTime = moment(today).format("hh:mm:ss");
    const title = req.body.title
    const msg = req.body.msg
    const typeId = req.body.typeId

    const data = [
        UserId,
        ClassID,
        typeId,
        atDate,
        atTime,
        title,
        msg
    ]

    console.log(data);
    
    database.addNotification(data,function (err, result) {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: 'Something went wrong' });
        }
        else {
            database.setGuardianNotificationFlag(ClassID,function(err,result){
                if (err) {
                    console.log(err);
                    res.json({ success: false, msg: 'Something went wrong' }); 
                }
                else{
                    database.setStudentNotificationFlag(ClassID,function(err,result){
                        if (err) {
                            console.log(err);
                            res.json({ success: false, msg: 'Something went wrong' }); 
                        }
                        else{
                            res.json({ success: true, msg: 'Notification Added' });
                        }
                    })
                }
            })
        }
    });
});

router.get('/getNotificationType', function (req, res, next) {

    database.getNotificationType(function (err, result) {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: 'Something went wrong' });
        }
        else {
            res.json({ success: true, data:result });
        }
    });
});

router.post('/addNotificationType', function (req, res, next) {
    const data =[
        req.body.name,
        req.body.typeId
    ]
    database.addNotificationType(data,function (err, result) {
        if (err) {
            if (err.sqlState == '23000') {
                res.json({ success: false, msg: 'Notification Type exist' });
                return false;
              }
            res.json({ success: false, msg: 'Something went wrong' });
        }
        else {
            res.json({ success: true, msg:"notification type Added" });
        }
    });
});

router.post('/deltNotification',function(req,res,next){
    const ClassID = req.body.ClassID
    const userId = req.body.userId
    const atDate = req.body.atDate
    const atTime = req.body.atTime
    database.detleteNotification(ClassID,userId,atDate,atTime,function (err, result) {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: 'Something went wrong' });
        }
        else {
            console.log(result);
            res.json({ success: true, msg: 'Notice deleted' });
        }
    });
});




module.exports = router;