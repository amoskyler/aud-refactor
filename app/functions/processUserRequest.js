var User = require('../models/user.js');
var Room = require('../models/room.js');
var Request = require('../models/request.js');
module.exports = function(req, res, user, room, err, callback){
  //if(!room) return room does not exist
  //if(!user && room), save user, associate to room
  //if(user && room), associate user to new room
  if(!room){
    if(err) return callback(err, false);
    console.log("room does not exist. Please enter a valid room code")
    return callback(null, false);  //failure
  }
  else if(room && !user){
    if(err) return callback(err, false);
    //create new user
    var newUser = new User({
      phone: req.body.phone,
      active: true,
      lastActive: Date.now(),
      room: room._id
    });
    //save user
    newUser.save(function(err, user){
      if(err) return callback(err, false);
      console.log("new user saved");
      //create new request from new User
      var newRequest = new Request({
        body: req.body.body,
        room: room._id,
        user: newUser._id
      });
      //save request from new user
      newRequest.save(function(err, request){
        if(err) return callback(err, false);
        console.log("Request created from new user");
        return callback(null, true)
      });
    })
  }
  else{
  var newRequest = new Request({
    body: req.body.body,
    room: room._id,
    user: user._id
  });
  newRequest.save(function(err, request){
    if(err) return callback(err, false);
    console.log("New Request from: "+ user.phone);
    user.update({active: true}, function(err, success){
      console.log("user sucessfully updated");
    });
    return callback(null, true);
  });
  }
};
