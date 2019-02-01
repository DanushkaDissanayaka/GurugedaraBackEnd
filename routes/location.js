const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/jwt');
const database = require('../databaseHandle/connectDatabase');

router.post('/addlocation',function(req,res,next){
    const data = [
        req.body.locationID,
        req.body.locationName
    ]
    database.addNewLocation(data,function(err,result){
        if(err){
            console.log(err);
            
            res.json({success : false , msg : "Error something wrong"});
        }
        else{
            res.json({success : true , msg : "Location Added"});
        }
    })
});

router.post('/deleteLocation',function(req,res,next){
    const locationID =req.body.locationID
    //console.log(locationID);
    database.dltLocation(locationID,function(err,result){ 
        if(err){
            console.log(err);
            res.json({success : false , msg : "Error something wrong"});
        }
        else{
            res.json({success : true , msg : "Location Deleted"});
        }
    })
});

router.get('/getLocation',function(req,res,next){
    database.getLocation(function(err,result){
        if(err){
            console.log(err);
            
            res.json({success : false , msg : "Error something wrong"});
        }
        else{
            res.json({success : true , data :result});
        }
    })
});


module.exports = router;