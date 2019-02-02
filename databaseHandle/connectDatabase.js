const mysql = require('mysql');
const conDetails = require('../config/database');
const tableSchema = require('./tableSchema');
const bcrypt = require('bcryptjs');

// create database connection
const con = mysql.createConnection(conDetails.conDetails);

// connect to database
module.exports.connet = function () {

    con.connect(function (err) {
        if (err) {
            throw err;
        }
        else {
            console.log('connected');
        }
    });

    for (let index = 0; index < tableSchema.tablesname.length; index++) {
        const tableName = tableSchema.tablesname[index];
        // check the availability of the tables
        con.query("CHECK TABLE " + tableName, function (err, result) {
            if (err) {
                throw err;
            }

            //DEBUG codes
            //console.log(tableName);
            //console.log(result[0].Msg_text);
            //console.log("Table 'webdata1.users' doesn't exist");
            //console.log("Table 'webdata1."+tableName+"'"+" doesn't exist");
            //Table 'webdata1.users' doesn't exist


            if (result[0].Msg_text == "Table '" + conDetails.conDetails.database + "." + tableName + "' doesn't exist") {
                // if =table not availble then create the tables
                createTables(tableSchema.tables[tableName].createTable);
            }
        });
    }
}

// function for create tables that not exits in datbase
function createTables(sql) {
    con.query(sql, function (err, result) {
        if (err) {
            //throw err;
            console.log(err);
        }
        else {
            console.log(result);
        }
    });
}

// fuction for add users in to user table
module.exports.addNewUser = function InsertUser(user, callback) {
    //console.log(user);
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(user[4], salt, function (err, hash) {
            if (err) {
                throw err;
            }
            user[4] = hash;
            con.query(tableSchema.tables.userData.insertIntoUserTable, [[user]], callback);
        })
    });
}

// function for add guardian for gurdian table
module.exports.addNewGuardian = function InsertUser(user, callback) {
    //console.log(user);
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(user[4], salt, function (err, hash) {
            if (err) {
                throw err;
            }
            user[4] = hash;
            con.query(tableSchema.tables.guardian.insertIntoTable, [[user]], callback);
        })
    });
}

module.exports.deleteUser = function (userId, callback) {
    con.query(tableSchema.tables.userData.deleteUser + mysql.escape(userId), callback);
}

//serch student before register guardian
module.exports.serchStuentGuardian = function (gurdianNic, callback) {
    con.query(tableSchema.tables.guardianstudent.selectStudents + mysql.escape(gurdianNic), callback);
}

//function for add student and Gurdian relationship table
module.exports.addStudentGuardian = function (studentAndGuardian, callback) {
    //console.log(studentAndGuardian);
    con.query(tableSchema.tables.guardianstudent.insertIntoTable, [studentAndGuardian], callback);
    //return callback(false,null);
}

// Add Student data to student table
module.exports.addStudent = function (student, callback) {
    //console.log(student);
    con.query(tableSchema.tables.student.insertIntoTable, [[student]], callback);
    //return callback(false,null);
}

module.exports.selectUser = function selectUser(usrname, callback) {
    con.query(tableSchema.tables.userData.SelectUser + mysql.escape(usrname), callback);
}

// serch gurdian
module.exports.selectGuardian = function selectUser(usrname, callback) {
    con.query(tableSchema.tables.guardian.SelectUser + mysql.escape(usrname), callback);
}

module.exports.comparePassword = function (candidatePassword, hash, callback) {
    //console.log(candidatePassword);
    //console.log(hash);

    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
        if (err) throw err;
        //console.log(isMatch);
        callback(null, isMatch);
    });
}

module.exports.countUser = function (role, callback) {
    con.query(tableSchema.tables.users.countusers, [role], callback);
}

module.exports.selectStudentInformationFromGurdianUsername = function (username, callback) {
    con.query(tableSchema.tables.users.selectStudentInformationFromGurdianUsername ,[username], callback);
}


// subject database request
module.exports.addSubject = function (subject, callback) {
    con.query(tableSchema.tables.subjects.insertIntoTable, [[subject]], callback)
}

module.exports.getSubject = function (callback) {
    con.query(tableSchema.tables.subjects.getSubject, callback)
}


// card database request

module.exports.SelectStudentWithCardId = function (cardId, callback) {
    con.query(tableSchema.tables.student.selectStudentRelevantToNuid, [cardId], callback);
}

module.exports.findStudentWithoutCard = function (callback) {
    con.query(tableSchema.tables.student.findStudentWithoutCard, callback);
}

module.exports.setCardId = function (UserId, CardId, callback) {
    con.query(tableSchema.tables.student.setCardId, [CardId, UserId], callback);
}



// location database request

module.exports.addNewLocation = function (data, callback) {
    con.query(tableSchema.tables.locations.insertIntoTable, [[data]], callback);
}
module.exports.dltLocation = function (data, callback) {
    con.query(tableSchema.tables.locations.deletLocation, [data], callback);
}
module.exports.getLocation = function (callback) {
    con.query(tableSchema.tables.locations.getLocations, callback);
}

// attendance database reqest

module.exports.getClassIdForAttendance = function (userId, deviceId, minTime, MaxTime, dateOfWeek, callback) {
    con.query(tableSchema.tables.multiTableQuerry.SearchClassIDWithDeviceIdUserIDTime, [deviceId, dateOfWeek, minTime, MaxTime, userId], callback);
}
module.exports.addAttendaceRecord = function (data, callback) {
    con.query(tableSchema.tables.attendance.insertIntoTable, [[data]], callback);
}

module.exports.getAttendance = function (userId, callback) {
    con.query(tableSchema, [userId], callback);
}

// Class database request

module.exports.getSutudentEnrolledClass = function (UserID, callback) {
    con.query(tableSchema.tables.studentclass.selectStudentEnrolledSubjects, [UserID], callback);
}

module.exports.enrolStudents = function (data, callback) {
    con.query(tableSchema.tables.studentclass.insertIntoTable, [[data]], callback);
}

module.exports.addNewClass = function (data, callback) {
    con.query(tableSchema.tables.classes.insertIntoTable, [[data]], callback);
}

module.exports.deleteClasse = function (classId, callback) {
    con.query(tableSchema.tables.classes.deleteClass, [classId], callback);
}
module.exports.getClassDetails = function (callback) {
    con.query(tableSchema.tables.classes.selectAllCalssesInfo, callback);
}

module.exports.getClassTItleFromTeacherId = function (teacherId, callback) {
    con.query(tableSchema.tables.classes.selectClassTitleFromTeacherId, [teacherId], callback);
}

module.exports.getAllClassStudentDetailsOfaClass = function (classId, callback) {
    con.query(tableSchema.tables.classes.getAllstudentDetailsOfaClass, [classId], callback);
}


// Notification database request
module.exports.setStudentNotificationFlag = function (classId, callback) {
    con.query(tableSchema.tables.multiTableQuerry.setStuentNotificationFlag, classId, callback);
}

module.exports.setGuardianNotificationFlag = function (classId, callback) {
    con.query(tableSchema.tables.multiTableQuerry.setGuardianNotificationFlag, classId, callback);
}

module.exports.addNotification = function (data, callback) {
    con.query(tableSchema.tables.notice.insertIntoTable, [[data]], callback);
}

module.exports.getNotification = function (userId, callback) {
    con.query(tableSchema.tables.notice.getnotice, userId, callback);
}

module.exports.getNotificationType = function (callback) {
    con.query(tableSchema.tables.noticetype.getnoticeType, callback);
}
module.exports.addNotificationType = function (data, callback) {
    con.query(tableSchema.tables.noticetype.insertIntoTable, [[data]], callback);
}

module.exports.getNotificationTeachers = function (userId, callback) {
    con.query(tableSchema.tables.notice.viewTeachersNotification, userId, callback);
}

module.exports.detleteNotification = function (ClassID, UserId, atDate, atTime, callback) {
    con.query(tableSchema.tables.notice.deleteNotice, [UserId, ClassID, atDate, atTime], callback);
}

// Fee database reques
module.exports.addFeerecord = function (data, callback) {
    con.query(tableSchema.tables.fee.insertIntoTable, [[data]], callback)
}

module.exports.changefeeRecords = function (data, callback) {
    con.query(tableSchema.tables.fee.insertIntoTable, [[data]], callback)
}

// marks database request

module.exports.addMarks = function (data, callback) {
    con.query(tableSchema.tables.mark.insertIntoTable, [[data]], callback)
}

// device database request

module.exports.adddevice = function (data, callback) {
    con.query(tableSchema.tables.device.insertIntoTable, [[data]], callback)
}

module.exports.getdevicedetails = function(callback){
    con.query(tableSchema.tables.device.selectAddDevice,callback);
}

