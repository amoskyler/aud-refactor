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

module.exports = function(app, passport, io){

io.sockets.on('connection', function (socket) {
    console.log("\t"+ socket.id+" has connected");
    socket.on('subscribe', function(data) {
      socket.join(data.room);
      socket.room = data.room;
      console.log(socket.room)
      socket.roomOwner = data.roomOwner;
      console.log(socket.roomOwner);
    });
    socket.on('unsubscribe', function(data) { socket.leave(data.room); });

    socket.on('disconnect', function(){
      if(socket.room){
        var connectionCounter = io.sockets.clients(socket.room).length;
      console.log("\t"+socket.id+" is disconnecting");
      console.log("roomId: "+socket.room);
      if(connectionCounter === 1){
        console.log("this was the users last open session. We should disconnect now");
        console.log(socket.room);

        var query = {$and:[{code: socket.room},{active: true}]};
        var update = {active: false}

        console.log("Deactivate: "+socket.room);

        deactivateRoom(socket.room, function(err, success){
          Room.findOneAndUpdate(query, update, function(err, room){
            if(!room) {
              if(err) return console.log(err)
              console.log("Room not active or does not exist")
              //return res.redirect('/room');
            }
            else {
              if(err) return console.log(err);
              console.log(socket.room+" has been deactivated");
              //socket.roomOwner.logout();
            };
          });
        });
      }
      else{
        console.log("This user still has: "+(connectionCounter-1)+" rooms open");
      }
    }
    else{
      console.log("somehow this socket got in here");
    }
  });

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
    console.log(req.user._id)
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
    console.log(io.sockets.manager.rooms);
    res.render('../views/socketAdmin.jade', {socketList: JSON.stringify(io.sockets.manager.rooms)});
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
