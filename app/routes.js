var Owner = require('./models/owner.js');
var Room = require('./models/room.js');
var User = require('./models/user.js');
var request = require('./models/request.js');
var express = require('express');
var bodyParser = require('body-parser');
var jade = require('jade');
var renderRoom = require('./functions/renderRoom');

module.exports = function(app){
//render response
  app.get('/', function(req, res){
    res.render('../views/index.jade');
  });

  app.get('/room', function(req, res){
    //render response
    res.render('../views/room.jade', {
      title: "Rdio Room",
      token: req.body.token || "enter token",
      roomId: req.body.roomId || "room ID",
      body: req.body.body ||"body",
      room: req.body.room || "room ID",
      phone: req.body.phone || "phone",
    });
  });

  app.get('/createRoom', function(req, res){
    res.redirect('/room');
  })

  app.get('/api/request', function(req, res){
    res.redirect('/')
  });

  app.post('/createRoom', function(req, res){
    //check if owner which matches request token exists
    Owner.findOne({ token: req.body.token}, function(err, owner){
      if(!owner){
        //create new room with request data
          newOwner = new Owner({
          ownerId: Date.now(),
          token: req.body.token,
          email: req.body.roomId,
          name: req.body.token
        });
          //save new owner, err out if err
        newOwner.save(function(err, owner, count){
          if(err) console.log(err);
            else console.log("Owner saved");
            //create newRoom
          var newRoom = new Room({
            owner: newOwner._id,
            code: makeid()
          });
          newRoom.save(function(err, room, count){
            if(err) return console.log(err);
            console.log("Room Saved")
            renderRoom(req, res);
          })

        })
      }
      else{
        console.log("Owner found");
        //start new room based off found owner
        Room.findOne({owner: owner._id}, function(err, room){
          if(!room){
            var newRoom = new Room({
              owner:owner._id,
              code: makeid()
            });
            newRoom.save(function(err, room){
              if(err) return console.log(err);
              renderRoom(req, res);
            });
          } else{
            console.log("Owner already has a room")
            renderRoom(req, res)
          };
        });
      };
    });
  });

  app.post('/api/request', function(req, res){
    //render response
    res.render('../views/room.jade', {
      title: "Rdio Room",
      token: req.body.token || "enter token",
      roomId: req.body.roomId || "room ID",
      body: req.body.body ||"body",
      room: req.body.room || "room ID",
      phone: req.body.phone || "phone"
    });
  });
};

var makeid = function()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
//generate random 3 length string
    for( var i=0; i < 3; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};
