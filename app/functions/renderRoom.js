var Room = require('../models/room.js');
var Request = require('../models/request.js');
var User = require('../models/user.js');
module.exports = function(req, res){

  Request.find({})
  .populate('Room')
  .populate('user')
  .exec(function(err, requests){
    //console.log(requests);
    Room.findOne({$and:[{owner: req.session.passport.user},{active: true}]})
    .populate('owner')
    .exec(function(err, rooms){
      User.find({}, function(err, users){
        res.render('../views/room.jade', {
          title: "Rdio Room",
          token: req.body.token || "enter token",
          body: req.body.body ||"body",
          phone: req.body.phone || "phone",
          code: req.body.code || "code",
          rooms : rooms,
          requests: requests,
          users: users,
          roomOwner: req.session.passport.user,
          roomCode: rooms.code
        });
      })
    });
  });
};
