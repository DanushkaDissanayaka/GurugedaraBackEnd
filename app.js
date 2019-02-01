const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const database = require ('./databaseHandle/connectDatabase');

const app = express();
const users = require('./routes/users');
const card = require('./routes/card');
const subject = require('./routes/subject');
const attendance = require('./routes/attendance');
const classes = require('./routes/class');
const notification = require('./routes/notification');
const marks = require('./routes/marks');
const fee = require('./routes/fee');
const location = require('./routes/location');
//set port
const port = 3000;
// connect to database
database.connet();
// cors middleware
app.use(cors());

//set static folder
app.use (express.static(path.join(__dirname,'public')));

// body-parser middleware
app.use(bodyParser.json());
// passport middle ware
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);


//Set users
app.use('/users',users);
// Set card
app.use('/card',card);

//Set marks
app.use('/mark',marks);

// Set subject
app.use('/subject',subject);

// Set subject route
app.use('/attendance',attendance);

// Set class route
app.use('/class',classes);

// Set class notification
app.use('/notification',notification);

// Set location
app.use('/location',location);

// Set class fee
app.use('/fee',fee);

// index route
app.get('/',function(req,res){
    res.send('Invalid Endpoint');
});
//start server
app.listen(port,function(){
    console.log('server started on port ' + port);
    });
