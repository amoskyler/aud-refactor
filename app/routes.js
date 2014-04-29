var Owner = require('./models/owner.js');
var Room = require('./models/room.js');
var User = require('./models/user.js');
var Request = require('./models/request.js');
var express = require('express');
var bodyParser = require('body-parser');
var jade = require('jade');
var renderRoom = require('./functions/renderRoom');

module.exports = function(app){

  //render the home page
  app.get('/', function(req, res){
    res.render('../views/index.jade');
  });

  //render the future room page
  app.get('/room', function(req, res){
    renderRoom(req, res);
  });

  //render the room creation page
  app.get('/createRoom', function(req, res){
    res.redirect('/room');
  })

  //does nothing as of now
  app.get('/api/request', function(req, res){
    res.redirect('/')
  });

  //create a new room
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
        });
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
          } else {
            console.log("Owner already has a room");
            renderRoom(req, res);
          };
        });
      };
    });
  });

  app.post('/deactivate', function(req, res){
    var query = {$and:[{code: req.body.roomCode},{active: true}]};
    var update = {active: false}
    console.log("Deactivate: "+req.body.roomCode);
    Room.findOneAndUpdate(query, update, function(err, room){
      if(!room) {
        console.log("Room not active or does not exist")
        return res.redirect('/room');
      }
      else {
        console.log(req.body.roomCode+" has been deactivated")
        return res.redirect('/room');
      };
    });
  });

  app.post('/activate', function(req, res){
    var query = {$and:[{code: req.body.roomCode},{active: false}]};
    var update = {active: true}
    console.log("activate: "+req.body.roomCode)
      Room.findOneAndUpdate(query, update, function(err, room){
        if(!room) {
          console.log("Room not active or does not exist")
          return res.redirect('/room');
        }
        else{
          console.log(req.body.roomCode+" has been activated")
          return res.redirect('/room');
        };
      });
    });

  app.post('/api/request', function(req, res){
    console.log(req.body.code);
    query = {$and:[{code: req.body.code},{active: true}]}
    Room.findOne(query, function(err, room){
      console.log(room);
      if(!room){
        console.log("that room does not exist");
        return res.redirect('/room');
      } else{
          var newRequest = new Request({
          body: req.body.body,
          room: room._id,
          user: req.body.phone,
          });
          newRequest.save(function(err, request){
            console.log("Request Created");
            return res.redirect('/room');
          })
      };
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
