var Room = require('../models/room.js');
var Request = require('../models/request.js');
var User = require('../models/user.js');
module.exports = function(req, res){
  Request.find({})
  .populate('Room')
  .populate('user')
  .exec(function(err, requests){
    //console.log(requests);
    Room.find({active: true})
    .populate('owner')
    .exec(function(err, rooms){
      User.find({}, function(err, users){
      //console.log(rooms);
        res.render('../views/room.jade', {
          title: "Rdio Room",
          token: req.body.token || "enter token",
          roomId: req.body.roomId || "room ID",
          body: req.body.body ||"body",
          room: req.body.room || "room ID",
          phone: req.body.phone || "phone",
          code: req.body.code || "code",
          rooms : rooms,
          requests: requests,
          users: users
        });
      })
    });
  });
};
