const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/jwt');
const database = require('../databaseHandle/connectDatabase');

router.post('/addDevice', function (req, res, next) {
    const data = [
        req.body.DeviceId,
        req.body.locationID,
        req.body.type,
    ]
    database.adddevice(data, function (err, result) {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: "Device add fail" });
        }
        else {
            res.json({ success: true, msg: "Device added" });
        }
    });
});

router.get('/getdevicedetails', function (req, res, next) {
    database.getdevicedetails(function (err, result) {
        if (err) {
            console.log(err);
            res.json({success:false})
        }
        else {
            res.json({ success: true, data: result });
        }
    });
})

module.exports = router;