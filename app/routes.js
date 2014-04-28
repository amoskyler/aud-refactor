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

    new Owner({
      ownerId : req.body.names,
      token : req.body.names,
      email : req.body.names,
      names : 'data'
    }).save(function(err, todo, count){
      res.redirect('/');
    });

    var newRoom = new Room();

/*
   newRoom.owner = newRoom._id;

    newRoom.codes = "blah";

    //newRoom.save();
*/
    //console.log(req.body.name);
    console.log(req.body.names);
    console.log(req.body.timestamp);
    res.redirect('/room');

  });

};

var handleError= function(err){
  console.log("punks");
}
