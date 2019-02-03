const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/jwt');
const database = require('../databaseHandle/connectDatabase');

router.post('/addMarks',function(req,res,next){
    const data = req.body.marks
    console.log(data);
    
            
    /*database.addMarks(data,function(err,result){
        if(err){
            console.log(err);
            res.json({success : false , msg : "Error something wrong"});
        }
        else{
            res.json({ success: true, msg: 'successfuly aded'});
        }
    })*/
})

module.exports = router;