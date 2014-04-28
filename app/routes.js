var Owner = require('./models/owner.js');
var Room = require('./models/room.js');
var express = require('express');
var bodyParser = require('body-parser');
module.exports = function(app){

  app.get('/', function(req, res){
    res.render('../views/index.jade');
  });

  app.get('/room', function(req, res){
    res.render('../views/room.jade');
  });

  app.get('/createRoom', function(req, res){
    res.redirect('/room');
  })

  app.post('/createRoom', function(req, res){
//This has to be the worst possible way of doing everything. But I don't know what I'm doing. I'm so sorry.
    checkOwner(req.body.token, function(err, exists){
      if(err){console.log("err")};
      if(exists){
        console.log("exists");
        ownerInfo = Owner.find(function(err, ownerInfo, count){
        });
        newRoom = new Room({
          owner: (ownerInfo)._id,
          code : Date.now()
        });

        newRoom.save(function(err, room, count){
          console.log("New room created and saved");
        })

      } else{
          var newOwner =  Owner({
              ownerId: req.body.names+req.body.timestamp,
              email : req.body.names + "@emailaddress.com",
              name : req.body.names,
              token : req.body.token
            });

          newOwner.save(function(err, owner, count){
            console.log("new owner saved");
            });

          newRoom = new Room({
            owner : newOwner._id,
            code: Date.now()
          });

          newRoom.save(function(err, room ,count){
            Room.find(function(err, roomInfo, count){
              console.log(roomInfo);
            })
          })
        };
    })

    res.redirect('/room');

  });

};

var handleError= function(err){
  console.log("punks");
}


function checkOwner(value, callback){
  Owner.count({token : value}, function(err, count){
    callback(err, !!count);
  })
};
