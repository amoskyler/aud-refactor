var Room = require('../models/room.js');

module.exports = function(req, res){
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
      rooms : rooms
    });
  });
};
