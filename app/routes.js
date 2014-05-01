var Owner = require('./models/owner.js');
var Room = require('./models/room.js');
var User = require('./models/user.js');
var Request = require('./models/request.js');
var express = require('express');
var bodyParser = require('body-parser');
var jade = require('jade');
var renderRoom = require('./functions/renderRoom');
var processUserRequest = require('./functions/processUserRequest');
var deactivateRoom = require('./functions/deactivateRoom');
var sockets = [];

module.exports = function(app, passport, io){

io.sockets.on('connection', function (socket) {
    console.log("\t"+ socket.id+" has connected");
    sockets.push(socket);
    socket.on('subscribe', function(data) { socket.join(data.room); });
    socket.on('unsubscribe', function(data) { socket.leave(data.room); });
});

  //render the home page
  app.get('/', function(req, res){
    res.render('../views/index.jade', {message: req.flash('loginMessage')});
  });

  app.get('/auth/rdio', passport.authenticate('rdio', {scope: 'email'}));

  app.get('/auth/rdio/callback',
    passport.authenticate('rdio', {
      successRedirect: '/createRoom',
      failureRedirect: '/'
    }));

  //render the future room page
  app.get('/room', isLoggedIn, function(req, res){
      io.sockets.emit("roomId", {data: "data which should be roomCode"});
      renderRoom(req, res);
  });

  //render the room creation page
  app.get('/createRoom', isLoggedIn, function(req, res){
    console.log("create Room")
    Room.findOne({$and:[{owner: req.user._id}, {active: true}]}, function(err, room){
      if(!room){
        var newRoom = new Room({
          owner: req.user._id,
          code: makeid()
        });
        newRoom.save(function(err, room, count){
          if(err) return console.log(err);
            console.log("Room Saved")
            res.redirect('/room');
        });
      }
      else{
        console.log("owner already has a room");
        res.redirect('/room');
      };
    });
  });

  //does nothing as of now
  app.get('/api/request', function(req, res){
    res.redirect('/')
  });

  app.post('/createRoom', isLoggedIn, function(req, res){
      res.redirect('/room');
    });
/*
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
        Room.findOne({$and:[{owner: owner._id}, {active: true}]}, function(err, room){
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
*/
  app.post('/deactivate', function(req, res){
    var query = {$and:[{code: req.body.roomCode},{active: true}]};
    var update = {active: false}
    console.log("Deactivate: "+req.body.roomCode);
    deactivateRoom(req.body.roomCode, function(err, success){
      Room.findOneAndUpdate(query, update, function(err, room){
        if(!room) {
          console.log("Room not active or does not exist")
          return res.redirect('/room');
        }
        else {
          if(err) return console.log(err);
          console.log(req.body.roomCode+" has been deactivated");
          req.logout();
          return res.redirect('/');
        };
      });
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
    query = {$and:[{code: req.body.code},{active: true}]};
    Room.findOne(query, function(err, room){
      User.findOne({phone: req.body.phone}, function(err, user){
        processUserRequest(req, res, user, room, err, function(err, success){
          if(success){
            console.log("success");
            res.redirect('/room');
            io.sockets.in(req.body.code).emit('request', {data: 'this is a request'});
          }
          else{
            console.log("failure");
            renderRoom(req, res);
            res.redirect('/room');
          };
        });
      });
    });
  });

  app.get('/socketadmin', function(req, res){
    res.send(io.sockets.manager.rooms);
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

function isLoggedIn(req, res, next){
  if (req.isAuthenticated())
    return next();

  res.redirect('/auth/rdio');
}
