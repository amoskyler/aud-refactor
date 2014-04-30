Room = require('../models/room.js');
User = require('../models/user.js');
Request = require('../models/request.js');

module.exports = function(roomCode, callback){
  Room.findOne({code: roomCode}, function(err, room){
    if(err) return callback(err, false);
    User.find({room: room._id}, function(err, users){
      if(err) return callback(err, false);
      users.forEach(function(user){
        user.update({active: false}, function(err, success){
          if(err) return callback(err, false);
          console.log("successfully deactivated user: " + user.phone)
        });
      });
    });
    return callback(null, true);
  });
};
