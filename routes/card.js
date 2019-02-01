const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/jwt');
const database = require('../databaseHandle/connectDatabase');

router.get('/studentWithoutCard',function(req,res,next){
    database.findStudentWithoutCard(function(err,result){
        if (err){
            console.log(err);
        }
        else{
            res.json(result);
        }
    });
});

router.post('/setCardId',function(req,res,next){
    UserId = req.body.UserId;
    CardId = req.body.CardId;
    database.setCardId(UserId,CardId,function(err,result){
        if(err){
            console.log(err);
            res.json({success : false , massage : "Error something wrong"});
        }
        else{
            //console.log(result);
            res.json({success : true , massage : "Card Id added to student " + req.body.UserId});
        }
    });
});

module.exports = router;