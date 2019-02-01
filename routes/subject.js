const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/jwt');
const database = require('../databaseHandle/connectDatabase');

router.post('/addSubject',function(req,res,next){
    subjectId = req.body.subjectId;
    subjectName = req.body.subjectName;

    subject = [
        subjectName,
        subjectId
    ]
    database.addSubject(subject,function(err,result){
        if (err) {
            if (err.sqlState == '23000') {
                res.json({ success: false, msg: 'Subject Code exist' });
                return false;
            }
            res.json({ success: false, msg: 'Something went wrong' });
            return false;
          }
          else {
                res.json({ success: true, msg: 'Subject Added' });
                return true;
          }
    });
});

router.get('/getSubject',function(req,res,next){
    database.getSubject(function(err,result){
        if (err){
            console.log(err);
        }
        else{
            res.json({data:result});
        }
    });
});

router.post('/dltsubject',function(req,res,next){
    const subjectId =req.body.subjectId
    //console.log(locationID);
    database.dltLocation(subjectId,function(err,result){ 
        if(err){
            console.log(err);
            res.json({success : false , msg : "Error something wrong"});
        }
        else{
            res.json({success : true , msg : "Location Deleted"});
        }
    })
});
module.exports = router;