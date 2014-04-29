var Room = require('../models/room.js');
var Request = require('../models/request.js')
module.exports = function(req, res){
  Request.find({})
  .populate('Room')
  .exec(function(err, requests){
    Room.find({active: true})
    .populate('owner')
    .exec(function(err, rooms){
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
        requests: requests
      });
    });
  });
};
