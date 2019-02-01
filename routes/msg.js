const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/jwt');
const database = require('../databaseHandle/connectDatabase');

router.post('/addNotification', function (req, res, next) {
    const today = momentTz.tz(new Date(), "Asia/Colombo");
    // const today = momentTz("2013-11-18 07:55");
    const resiverUserId = req.body.resiverUserId
    const senderUserId = req.body.senderUserId
    const atDate = moment(today).format("YYYY-MM-DD");
    const atTime = moment(today).format("hh:mm:ss");
    const title = req.body.title
    const msg = req.body.msg
    const typeId = req.body.typeId

    const data = [
        resiverUserId, 
        senderUserId,     
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
                    res.json({ success: false, msg: 'Something went wrong' }); 
                }
                else{
                    database.setStudentNotificationFlag(ClassID,function(err,result){
                        if (err) {
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

module.exports = router;