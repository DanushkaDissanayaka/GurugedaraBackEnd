const tables = {
    userData :{
        createUserTable :"CREATE TABLE users (DOB date,MsgFlag boolean DEFAULT 0,NotificationFlag boolean DEFAULT 0,Email varchar(50),UserID char(10),ContactNo char(10),password varchar(100),AddStreet varchar(50),AddCity varchar(50),AddNo varchar(10),FirstName varchar(20),LastName varchar(20),MiddleName varchar(20),role varchar(10),CONSTRAINT PK_user PRIMARY key(UserID))",
        insertIntoUserTable : "insert into users(DOB,Email,UserID,ContactNo,password,AddStreet,AddCity,AddNo,FirstName,LastName,MiddleName,role) values ?",
        SelectUser : 'SELECT * from users WHERE UserID =',
        deleteUser: 'DELETE FROM users WHERE UserId = ',
    },

    users :{
        createTable :'CREATE TABLE users ('+
            'DOB date,'+
            'MsgFlag boolean DEFAULT 0,'+
            'NotificationFlag boolean DEFAULT 0,'+
            'Email varchar(50) UNIQUE,'+
            'UserID char(10),'+
            'ContactNo char(10),'+
            'password varchar(100),'+
            'AddStreet varchar(50),'+
            'AddCity varchar(50),'+
            'AddNo varchar(10),'+
            'FirstName varchar(20),'+
            'LastName varchar(20),'+
            'MiddleName varchar(20),'+
            'role varchar(10),'+
            'CONSTRAINT PK_user PRIMARY key(UserID))',
        insertIntoTable : "insert into users(DOB,Email,UserID,ContactNo,password,AddStreet,AddCity,AddNo,FirstName,LastName,MiddleName,role) values ?",
        SelectUser : 'SELECT * from users WHERE UserID =',
        countusers:'SELECT COUNT(role) AS number FROM users WHERE role = ?',
        selectStudentInformationFromGurdianUsername :"SELECT * FROM users WHERE UserID IN (SELECT UserId FROM guardianStudent WHERE guardianNIC IN (SELECT guardianNIC FROM guardian WHERE username = ?))",
        desebleNotificationFlag:"UPDATE users SET NotificationFlag = 0 WHERE UserID = ?",
        setMessageFlag:"UPDATE users SET MsgFlag = 1 WHERE UserID = ?",
        disableMessageFlag:"UPDATE users SET MsgFlag = 0 WHERE UserID = ?",
        selectAllRoleType:"Select * from users  WHERE role = ?",
        changePassword:"UPDATE users SET password = ? WHERE UserID = ?",
        updateUserProfile:"UPDATE users SET  Email =? ContactNo =? AddStreet = ? AddCity = ? AddNo = ? FirstName = ? LastName = ? MiddleName = ? WHERE UserID = ?"
    },

    guardian:{
        createTable:"create table guardian("+
            'DOB date,'+
            'MsgFlag boolean DEFAULT 0,'+
            'NotificationFlag boolean DEFAULT 0,'+
            'Email varchar(50) UNIQUE,'+
            'username char(30) UNIQUE,'+
            'password varchar(100),'+
            'ContactNo char(10),'+
            'AddStreet varchar(50),'+
            'AddCity varchar(50),'+
            'AddNo varchar(10),'+
            'FirstName varchar(20),'+
            'LastName varchar(20),'+
            'MiddleName varchar(20),'+
            'guardianNIC varchar(10),'+
            'CONSTRAINT pk_guardian PRIMARY key(guardianNIC))',

        insertIntoTable:'insert into guardian(DOB,Email,username,ContactNo,password,AddStreet,AddCity,AddNo,FirstName,LastName,MiddleName,guardianNIC) values ?',
        SelectUser :'SELECT * from guardian WHERE username =',
        getGurdianInfoFromStudentId:"SELECT FirstName,LastName,username FROM `guardian` WHERE guardianNIC IN (SELECT guardianNIC FROM `guardianStudent` WHERE UserId = ?)",
        changePassword:"UPDATE guardian SET password = ? WHERE username = ?",
        desebleNotificationFlag:"UPDATE guardian SET NotificationFlag = 0 WHERE UserID = ?",
        setMessageFlag:"UPDATE users SET MsgFlag = 1 WHERE username = ?",
        disableMessageFlag:"UPDATE users SET MsgFlag = 0 WHERE username = ?",
        updateGuardianProfile:"UPDATE users SET  Email =? ContactNo =? AddStreet = ? AddCity = ? AddNo = ? FirstName = ? LastName = ? MiddleName = ? WHERE username = ?"
    },

    student:{
        createTable:'CREATE TABLE Student('+
            'UserId varchar(10),'+
            'CardId varchar(10) UNIQUE,'+
            'FeeType varchar(6),'+
            'School varchar(50),'+
            'CONSTRAINT pk_student PRIMARY KEY (UserId),'+
            'CONSTRAINT fk_student FOREIGN KEY (UserId) REFERENCES users( UserId) ON DELETE CASCADE)',
            
    insertIntoTable :'insert into Student(UserId,CardId,FeeType,School)values ?',
    findStudentWithoutCard:'SELECT UserId FROM `Student` WHERE CardId is null',
    setCardId : "UPDATE Student SET CardId = ? WHERE UserId = ?",
    selectStudentRelevantToNuid :"SELECT UserId FROM `Student` WHERE CardId = ?"
    },

    guardianstudent:{
        createTable:"create table guardianStudent("+
            "guardianNIC varchar(10),"+
            "UserId varchar(10),"+
            "CONSTRAINT pk_gurdianStudent PRIMARY key(guardianNIC,UserId),"+
            "CONSTRAINT fk_guardianStudent_student FOREIGN KEY (UserId) REFERENCES users( UserId) ON DELETE CASCADE)",

        insertIntoTable:'insert into guardianStudent(guardianNIC,UserId) values ?',
        selectStudents:'SELECT UserId FROM `guardianStudent` WHERE guardianNIC = ',
    },

    device:{
        createTable: "create table device(" +
            "DeviceId      varchar(10),"+
            "locationID    varchar(10),"+
            "type          varchar(10),"+
            "CONSTRAINT pk_device PRIMARY key(DeviceId),"+
            "CONSTRAINT fk_device_locations FOREIGN KEY (locationID) REFERENCES locations( locationID) ON DELETE CASCADE)",
        insertIntoTable :"INSERT INTO device(DeviceId,locationID,type) VALUES ?",
        selectAddDevice:"SELECT * FROM device"
    },
    locations:{
        createTable :"create  table locations("+
            "locationID    varchar(10),"+
            "locationName  varchar(50),"+
            "CONSTRAINT pk_locations PRIMARY key(locationID))",
        insertIntoTable : "INSERT INTO locations (locationID,locationName) VALUES ?",
        deletLocation : "DELETE FROM locations WHERE locationID = ? ",
        getLocations : "SELECT * FROM locations"
    },
    subjects:{
        createTable:"create table subjects("+
            "subjectName   varchar(100),"+
            "subjectID     varchar(10),"+
            "CONSTRAINT pk_subjects PRIMARY key(subjectID))",
        insertIntoTable : "INSERT INTO subjects (subjectName,subjectID) VALUES ?",
        getSubject :"Select * from subjects"
    },

    classes:{
        createTable: "create table classes ("+
            "ClassID    varchar(10),"+
            "subjectID	varchar(10),"+
            "locationID	varchar(10),"+
            "teacherID   varchar(10),"+
            "dateOfWeek  int,"+
            "halfFee     decimal(7,2),"+
            "fullFee     decimal(7,2),"+
            "startTime   time,"+
            "endTime     time,"+
            "description varchar(50),"+
            "Title varchar(100),"+
            "CONSTRAINT pk_classes           PRIMARY key(ClassID),"+
            "CONSTRAINT fk_classes_teacher   FOREIGN KEY (teacherID)   REFERENCES users( UserId)         ON DELETE CASCADE,"+
            "CONSTRAINT fk_classes_subjects  FOREIGN KEY (subjectID)   REFERENCES subjects(subjectID)    ON DELETE CASCADE,"+
            "CONSTRAINT fk_classes_locations FOREIGN KEY (locationID)  REFERENCES locations(locationID)  ON DELETE CASCADE)",
        insertIntoTable:"insert INTO classes (ClassID,subjectID,locationID,teacherID,dateOfWeek,halfFee,fullFee,startTime,endTime,description,Title) VALUES ?",
        SelectClassWithDeviceId:"SELECT * FROM classes WHERE locationID IN (SELECT locationID FROM device WHERE DeviceId = ?) AND dateOfWeek = ?",
        deleteClass :"DELETE FROM classes WHERE ClassID = ?",
        selectAllCalssesInfo:"SELECT * FROM classes",
        selectClassTitleFromTeacherId :"SELECT ClassID,title FROM classes WHERE teacherID = ?",
        getAllstudentDetailsOfaClass : "SELECT * FROM users WHERE UserID IN (SELECT UserID FROM studentClass WHERE ClassID = ?)"
    },
    studentclass:{
        createTable:"create table studentClass("+
            "UserID    varchar(10),"+
            "ClassID   varchar(10),"+
            "CONSTRAINT pk_studentClass             PRIMARY key(ClassID,UserID),"+
            "CONSTRAINT fk_studentClass_users    FOREIGN KEY (UserID) REFERENCES users(UserID) ON DELETE CASCADE,"+
            "CONSTRAINT fk_studentClass_classes  FOREIGN KEY (ClassID) REFERENCES classes(ClassID) ON DELETE CASCADE)",
        insertIntoTable:"INSERT INTO studentClass (UserID,ClassID) VALUES ?",
        selectStudentEnrolledSubjects :"SELECT * FROM classes WHERE ClassID IN (SELECT ClassID FROM studentClass WHERE UserID = ?)",
        unEnrollStudent:"DELETE FROM studentClass WHERE UserID = ? AND ClassID = ?",
    },
    attendance: {
        createTable : "create table Attendance("+
            "DeviceId	varchar(10),"+
            "UserId		varchar(10),"+
            "ClassId		varchar(10),"+
            "atDate		date,"+
            "InTime		time,"+
            "outTime   time,"+
            "CONSTRAINT pk_Attendance PRIMARY  key(atDate,UserId,ClassId,InTime),"+
            "CONSTRAINT fk_Attendance_student  FOREIGN KEY (UserId)   REFERENCES users( UserId)      ON DELETE CASCADE,"+
            "CONSTRAINT fk_Attendance_device   FOREIGN KEY (DeviceId)  REFERENCES device(DeviceId)   ON DELETE CASCADE,"+
            "CONSTRAINT fk_Attendance_classes  FOREIGN KEY (ClassId)  REFERENCES classes(ClassId)    ON DELETE CASCADE)",
            insertIntoTable : "INSERT INTO Attendance (DeviceId,UserId,ClassId,atDate,InTime) VALUES ?",
            getAttendanceStudent : "SELECT * FROM Attendance WHERE MONTH(atDate) = ? AND YEAR(atDate) = ? AND ClassId = ? AND UserId = ?",
            getAttendanceTeacher : "SELECT * FROM `Attendance` WHERE MONTH(atDate) = ? AND YEAR(atDate) = ? AND ClassId = ?",
    },
    fee:{
        createTable :"create table fee("+
            "feeId int NOT NULL AUTO_INCREMENT,"+
            "StudentId    varchar(10),"+
            "OfficeuserId varchar(10),"+
            "ClassID   varchar(10),"+
            "atDate    date,"+
            "amount    decimal(7,2),"+
            "CONSTRAINT pk_studentClass             PRIMARY key(ClassID,StudentId,atDate),"+
            "CONSTRAINT fk_fee_users_student        FOREIGN KEY (StudentId) REFERENCES users(UserID) ON DELETE CASCADE,"+
            "CONSTRAINT fk_fee_users_officeuser     FOREIGN KEY (OfficeuserId) REFERENCES users(UserID) ON DELETE CASCADE,"+
            "CONSTRAINT fk_fee_classes  FOREIGN KEY (ClassID) REFERENCES classes(ClassID) ON DELETE CASCADE)",
            insertIntoTable : "INSERT INTO fee (StudentId,OfficeuserId,ClassID,atDate,amount) VALUES ?",
            getFeeStudent : "SELECT * FROM fee WHERE MONTH(atDate) = ? AND YEAR(atDate) = ? AND ClassID = ? AND StudentId = ?",
            getFeeTeacher : "SELECT * FROM `fee` WHERE MONTH(atDate) = ? AND YEAR(atDate) = ? AND ClassID = ?",
            updateFee:"UPDATE fee SET ClassID = ? amount = ? WHERE feeId = ?",
    },
    mark:{
        createTable :"create table mark("+
            "markId int NOT NULL AUTO_INCREMENT,"+
            "UserId    varchar(10),"+
            "ClassID   varchar(10),"+
            "atDate    date,"+
            "marks     int,"+
            "description varchar(255),"+
            "CONSTRAINT pk_mark             PRIMARY key(ClassID,UserId,atDate),"+
            "CONSTRAINT fk_mark  FOREIGN KEY (UserId) REFERENCES users(UserID) ON DELETE CASCADE,"+
            "CONSTRAINT fk_pk_mark_classes  FOREIGN KEY (ClassID) REFERENCES classes(ClassID) ON DELETE CASCADE)",
            insertIntoTable :"INSERT INTO mark (UserId,ClassID,atDate,marks,description) VALUES ?",
            getMarkStudent : "SELECT * FROM mark WHERE MONTH(atDate) = ? AND YEAR(atDate) = ? AND ClassID = ? AND UserId = ?",
            getMarkTeacher : "SELECT * FROM `mark` WHERE MONTH(atDate) = ? AND YEAR(atDate) = ? AND ClassID = ?",
            udateMarks:"UPDATE mark SET marks = ? WHERE markId = ?",
    },
    notice:{
        createTable:"create table notice(" +
                "UserId    varchar(10),"+
                "ClassID   varchar(10),"+
                "typeId    varchar(10),"+
                "atDate    date,"+
                "atTime    time,"+
                "title    varchar(50),"+
                "msg       varchar(100),"+
                "CONSTRAINT pk_notice              PRIMARY key(ClassID,UserId,atDate,atTime),"+
                "CONSTRAINT fk_notice              FOREIGN KEY (UserId)    REFERENCES users(UserID)    ON DELETE CASCADE,"+
                "CONSTRAINT fk_notice_classes      FOREIGN KEY (ClassID)   REFERENCES classes(ClassID) ON DELETE CASCADE,"+
                "CONSTRAINT fk_notice_noticetype   FOREIGN KEY (typeId)    REFERENCES noticetype(typeId)ON DELETE CASCADE)",
        insertIntoTable :"INSERT INTO notice (UserId,ClassID,typeId,atDate,atTime,title,msg) VALUES ?",
        getnotice : "SELECT classes.Title,T1.title,msg,atDate,atTime FROM classes INNER JOIN (SELECT * FROM notice WHERE ClassID IN (SELECT ClassID FROM Student WHERE UserID = ?)) as T1 ON classes.ClassID = T1.ClassID",
        viewTeachersNotification : "SELECT T1.ClassID,classes.Title,T1.title,msg,atDate,atTime FROM classes INNER JOIN (SELECT * FROM notice WHERE UserId =?) AS T1 ON classes.ClassID = T1.ClassID",
        deleteNotice : "DELETE FROM notice WHERE UserId = ? AND ClassID = ? AND atDate = ? AND atTime = ?"
    },
    noticetype:{
        createTable:"create table noticetype("+
            "name      varchar(20),"+
            "typeId    varchar(10),"+
            "CONSTRAINT pk_type      PRIMARY key(typeId))",
            insertIntoTable : "INSERT INTO noticetype (name,typeId) VALUES ?" ,
            getnoticeType:"SELECT * FROM noticetype",
    },

    /*mark :{
        createTable : "create table mark("+
            "UserId    varchar(10),"+
            "ClassID   varchar(10),"+
            "atDate    date,"+
            "marks     int,"+
            "description varchar(255),"+
            "CONSTRAINT pk_mark             PRIMARY key(ClassID,UserId,atDate),"+
            "CONSTRAINT fk_mark  FOREIGN KEY (UserId) REFERENCES users(UserID) ON DELETE CASCADE,"+
            "CONSTRAINT fk_pk_mark_classes  FOREIGN KEY (ClassID) REFERENCES classes(ClassID) ON DELETE CASCADE)",
            insertIntoTable :"INSERT INTO mark (UserId,ClassID,atDate,marks,description) VALUES ?",
    },*/
    msg :{
        createTable : "create table msg("+
            "resiverUserId      varchar(10),"+
            "senderUserId       varchar(10),"+
            "atDate             date,"+
            "atTime             time,"+
            "title              varchar(50),"+
            "msg                varchar(255),"+
            "CONSTRAINT pk_msg                           PRIMARY key(atDate,atTime,resiverUserId,senderUserId),"+
            "CONSTRAINT fk_msg_resiverUser               FOREIGN KEY (resiverUserId)   REFERENCES users(UserId)     ON DELETE CASCADE,"+
            "CONSTRAINT fk_msg_senderUserId              FOREIGN KEY (senderUserId)    REFERENCES users(UserId)      ON DELETE CASCADE)",
        insertIntoTable :"INSERT INTO msg (resiverUserId,senderUserId,atDate,atTime,title,msg) VALUES ?",
        outboxMsg:"",
        inboxeMsg:"",
        deleteNotice : "DELETE FROM notice WHERE UserId = ? AND ClassID = ? AND atDate = ? AND atTime = ?"
    },
    multiTableQuerry : {
        SearchClassIDWithDeviceIdUserIDTime : "SELECT classID FROM studentClass WHERE ClassID IN (SELECT ClassID FROM classes WHERE locationID IN (SELECT locationID FROM device WHERE DeviceId = ?) AND dateOfWeek = ? AND startTime BETWEEN ? AND ?) AND UserID = ?",
        setStuentNotificationFlag :"UPDATE users SET NotificationFlag = 1 WHERE UserID IN (SELECT UserId FROM studentClass WHERE ClassID = ?)",
        setGuardianNotificationFlag:"UPDATE guardian SET NotificationFlag = 1 WHERE guardianNIC IN (SELECT guardianNIC FROM guardianStudent WHERE UserId IN (SELECT UserId FROM studentClass WHERE ClassID = ?))",
    }
}

module.exports.tables = tables;

module.exports.tablesname = [
                                'users',
                                'student',
                                'guardian',
                                'guardianstudent',
                                'locations',
                                'subjects',
                                'device',
                                'classes',
                                'studentclass',
                                'attendance',
                                'noticetype',
                                'fee',
                                'notice',
                                'msg',
                                'mark'
                            ];