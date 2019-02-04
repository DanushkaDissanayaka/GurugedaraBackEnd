const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/jwt');
const database = require('../databaseHandle/connectDatabase');
const moment = require('moment');
const momentTz = require('moment-timezone');


//change user password by addmin 

router.post('/changeUserpasswordAdmin', function (req, res, next) {
  const role = req.body.role
  const password = req.body.password
  const userId = req.body.userId

  if (role == 'guardian') {
    database.ChangePasswordGuardian(userId, password, function (err, result) {
      if (err) {
        res.json({ success: false, msg: "error canot change password" });
      }
      else {
        res.json({ success: true, msg: "password change success" });
      }
    });
  }
  else {
    database.changepassworsUser(userId, password, function (err, result) {
      if (err) {
        res.json({ success: false, msg: "error canot change password" });
      }
      else {
        res.json({ success: true, msg: "password change success" });
      }
    });
  }
})

// register user
router.post('/studentRegister', function (req, res, next) {

  //console.log(req.body);
  database.countUser(req.body.role, function (err, result) {
    var number = result[0].number + 100
    var ID = req.body.role.substr(0, 1).toUpperCase() + number.toString(); // generate user ID
    let student = new user(req.body, ID);

    student.registerStudent(function (value) {
      res.json(value);
    });
  });

});

//debug route no need 
router.post('/getuserId', function (req, res, next) {
  const role = req.body.role;
  console.log(getNewId(role));
});

//get student details from gurdian user name
router.post('/getstudentFromGuardian', function (req, res, next) {
  const username = req.body.username;
  database.selectStudentInformationFromGurdianUsername(username, function (err, result) {
    if (err) {
      console.log(err);
      res.json({ success: false, msg: 'Something went wrong' });
    }
    else {
      res.json({ success: true, data: result });
    }
  });
});

// office user registration / addmin / teacher
router.post('/officeuserRegister', function (req, res, next) {

  database.countUser(req.body.role, function (err, result) {
    var number = result[0].number + 100 // generate user ID
    var ID = req.body.role.substr(0, 1).toUpperCase() + number.toString();
    let officeuser = new user(req.body, ID);
    officeuser.registerOfficeUser(function (value) {
      res.json(value);
    })
  });

});
//guardian registration
router.post('/register', function (req, res, next) {
  gurdianNic = req.body.guardianNIC;
  UserId = req.body.StudentUserId;
  studentFlag = false;
  //console.log(gurdianNic);
  //console.log(UserId);

  database.serchStuentGuardian(gurdianNic, function (err, user) {
    //console.log(user);
    if (user.length != 0) {
      for (let index = 0; index < user.length; index++) {
        //console.log(user[index].UserId);
        if (UserId == user[index].UserId) {
          studentFlag = true;
          break;
        }
      }
      if (studentFlag) {
        //console.log("Student found");
        sqlUser = [
          req.body.DOB,
          req.body.email,
          req.body.username,
          req.body.ContactNo,
          req.body.password,
          req.body.AddStreet,
          req.body.AddCity,
          req.body.AddNo,
          req.body.FirstName,
          req.body.LastName,
          req.body.MiddleName,
          req.body.guardianNIC,
        ]
        //console.log(sqlUser);
        database.addNewGuardian(sqlUser, function (err, user) {
          if (err) {
            if (err.sqlState == '23000') {
              res.json({ success: false, msg: 'User name / email exist' });
              return false;
            }
            res.json({ success: false, msg: 'Something went wrong' });
            return false;
          }
          else {
            res.json({ success: true, msg: 'User registerd' });
            return true;
          }
        });
        return true;
      }
      else {
        res.json({ success: false, msg: 'Student Not found please check Student registration Number' });
      }
    }
    else {
      res.json({ success: false, msg: 'Student Not found please check NIC Number' });
    }
  });
});

// login route
router.post('/authenticate', function (req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  //console.log(username);
  //console.log(password);
  database.selectUser(username, function (err, user) {
    if (err) {
      throw err;
    }
    else {
      console.log(user);
      //console.log(user.length);
      if (user.length === 0) {
        // if we canot find user name in user table we have to serch gurdian table
        gurdianLogin(username, password, function (value) {
          res.json(value);
        });
        //res.json({ success: false, msg: 'User not Found' });
      }
      else {
        database.comparePassword(password, user[0].password, function (err, isMatch) {
          if (err) {
            throw err;
          }
          if (isMatch) {
            const token = jwt.sign(toObject(user), config.secret, {
              expiresIn: 604800 //1week
            });
            //console.log(token);
            //console.log(user[0]);
            res.json({
              success: true,
              token: 'JWT ' + token,
              userId: user[0].UserID,
              role: user[0].role,
            });
          }
          else {
            res.json({ success: false, msg: 'Wrong password' });
          }
        })
      }
    }
  });
});

// user profile authendication not using
router.get('/profile', passport.authenticate('jwt', { session: false }), function (req, res, next) {
  res.json({ user: req.user });
});

// route for debug purpuse look in to device data
router.post('/device', function (req, res, next) {
  console.log(req.body);
  res.json({ success: true, massage: "this is the massage" })
});

// get user tabale user details from user id
router.post('/findUser', function (req, res, next) {
  const userId = req.body.userId
  database.selectUser(userId, function (err, result) {
    if (err) {
      res.json({ success: false, msg: "Connection error" });
    }
    else {
      for (let index = 0; index < result.length; index++) {
        result[index].DOB = moment(result[index].DOB).format("YYYY-MM-DD");
      }
      res.json({ success: true, data: result });
    }
  })
})

// get gurdian infromation from student id
router.post('/getGurdianInfoFromStudentId', function (req, res, next) {
  const userId = req.body.userId
  database.getgurdianInfoFromStudentId(userId, function (err, result) {
    if (err) {
      res.json({ success: false, msg: "Connection error" });
    }
    else {
      res.json({ success: true, data: result });
    }
  });
});

// user profile updata route
router.post('/updateUserProfile', function (req, res, next) {
  sqlUser = [
    req.body.email,
    req.body.ContactNo,
    req.body.AddStreet,
    req.body.AddCity,
    req.body.AddNo,
    req.body.FirstName,
    req.body.LastName,
    req.body.MiddleName,
    req.body.userId
  ]

  const role = req.body.role

  if (role == "guardian") {
    database.updateGuardianprofile(sqlUser, function (err, result) {
      if (err) {
        console.log(err);
        
        res.json({ success: false, msg: "Update error please try again later" });
      }
      else {
        res.json({ success: true, msg: "Update done update profile" });
      }
    });
  }
  else {
    database.updateUserprofile(sqlUser, function (err, result) {
      if (err) {
        console.log(err);
        res.json({ success: false, msg: "Update error please try again later" });
      }
      else {
        res.json({ success: true, msg: "Update done update profile" });
      }
    });
  }

});

// select all users for a peticuler role
router.post('/getAllStudentDetailsFromRole', function (req, res, next) {
  const role = req.body.role
  database.gelAllusersInfoWithRole(role, function (err, result) {
    if (err) {
      res.json({ success: false, msg: "Connection error" });
    }
    else {
      res.json({ success: true, data: result });
    }
  })
});


// get guardian details route
router.post('/getguardianDetails', function (req, res, next) {
  const username = req.body.userId
  database.getGurdianInfomation(username, function (err, result) {
    if (err) {
      console.log(err);
      res.json({ success: false, msg: "something wrong in other end" })
    }
    else {
      res.json({ success: true, data: result });
    }
  })
});


module.exports = router;

function toObject(user) {
  return {
    //name : user[0].Fname,
    UserID: user[0].UserID,
    //password : user[0].password,
    //email :     user[0].emai
  }
}

function toObjectGuardian(user) {
  return {
    //name : user[0].Fname,
    UserID: user[0].username,
    //password : user[0].password,
    //email :     user[0].emai
  }
}

function user(User, ID) {
  console.log(ID);

  User.UserID = ID//getNewId(User.role);
  const userDetails = {
    role: User.role,
    usetID: User.UserID,
  };

  this.sqlUser = [
    User.DOB,
    User.email,
    User.UserID,
    User.ContactNo,
    User.password,
    User.AddStreet,
    User.AddCity,
    User.AddNo,
    User.FirstName,
    User.LastName,
    User.MiddleName,
    User.role
  ] // arry for add SQL

  const guardians = User.guardians;

  const student = [
    User.UserID,
    null,
    User.Feetype,
    User.School,
  ]

  this.registerStudent = function (callback) {

    for (let index = 0; index < guardians.length; index++) {
      guardians[[index]].push(User.UserID);
      //console.log(guardians[index]);
    }

    // this function will add all type of system users details
    if (userDetails.role == 'student') {
      database.addNewUser(this.sqlUser, function (err, user) {
        if (err) {
          console.log(err);
          if (err.sqlState == '23000') {
            callback({ success: false, msg: 'Email exist' });
            return false;
          }
          console.log(err);
          callback({ success: false, msg: 'Something went wrong' });
          return false;
        }
        else {
          database.addStudent(student, function (err, user) {
            if (err) {
              console.log(err);
              database.deleteUser(userDetails.usetID, function (err, user) {
                if (err) {
                  console.log("Delete user error from add student add user function" + err);
                }
                callback({ success: false, msg: 'Something went wrong please try again' });
                return false;
              });
            } else {
              database.addStudentGuardian(guardians, function (err, user) {
                if (err) {
                  console.log(err);
                  database.deleteUser(userDetails.usetID, function (err, user) {
                    if (err) {
                      console.log("Delete user error from addStudentGuardian add user function" + err);
                    }
                  });
                  callback({ success: false, msg: 'Something went wrong please try again' });
                  return false;
                }
                else {
                  callback({ success: true, msg: 'User registerd' });
                  return true;
                }
              });
            }
          });
        }
      });
      return true;
    }
    else {
      callback({ success: false, msg: "No user added" });
      return false
    }
  }

  this.registerOfficeUser = function (callback) {
    database.addNewUser(this.sqlUser, function (err, user) {
      if (err) {
        if (err.sqlState == '23000') {
          callback({ success: false, msg: 'Email exist' });
          return false;
        }
        callback({ success: false, msg: 'Something went wrong' });
        return false;
      }
      else {
        callback({ success: true, msg: 'User registerd' });
        return true;
      }
    });
    return true;
  }

  this.registerTeacher = function (callback) {

  }

  this.registerGurdian = function (callback) {
    /*database.addGuardian(this.sqlUser, function (err, user) {
        if (err) {
          if (err.sqlState == '23000') {
            callback({ success: false, msg: 'User name exist' });
            return false;
          }
          callback({ success: false, msg: 'Something went wrong' });
          return false;
        }
        else {
          callback({ success: true, msg: 'User registerd' });
          return true;
        }
      });
      return true;*/
  }

}

function gurdianLogin(username, password, callback) {
  database.selectGuardian(username, function (err, user) {
    if (err) {
      throw err;
    }
    else {
      if (user.length === 0) {
        callback({ success: false, msg: 'User not Found' });
      }
      else {
        database.comparePassword(password, user[0].password, function (err, isMatch) {
          if (err) {
            throw err;
          }
          if (isMatch) {
            const token = jwt.sign(toObjectGuardian(user), config.secret, {
              expiresIn: 604800 //1week
            });
            console.log(token);
            //console.log(user[0]);
            callback({
              success: true,
              token: 'JWT ' + token,
              role: 'guardian',
              userId: user[0].username
            });
          }
          else {
            callback({ success: false, msg: 'Wrong password' });
          }
        })
      }
    }
  });
}

function getNewId(role) {
  try {
    var myDate = new Date();
    var year = "" + myDate.getFullYear();
    var varID = year.substr(2, 2) + "" + daysintoYear(myDate) + "" + myDate.getHours() + "" + myDate.getSeconds() + "" + myDate.getMilliseconds();
    if (varID.length > 10) {
      varID = varID.substr(0, 9)
    }
    //console.log(daysintoYear(myDate));
    //console.log(role.substr(0,1).toUpperCase()+varID);
    return "S100"//role.substr(0, 1).toUpperCase() + varID;
  }
  catch (e) {
    console.log(e.message);
    return "err"
  }
}
function daysintoYear(date) {
  return (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;
}