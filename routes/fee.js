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

module.exports = router;