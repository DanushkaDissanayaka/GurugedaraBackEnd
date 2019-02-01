const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/jwt');
const database = require('../databaseHandle/connectDatabase');

router.get('/addDevice',function(req,res,next){
    database.findStudentWithoutCard(function(err,result){
        if (err){
            console.log(err);
        }
        else{
            res.json(result);
        }
    });
});

module.exports = router;