var Owner = require('./models/owner.js');
var Room = require('./models/room.js')
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
    /* var newOwner = new Owner();
    var newRoom = new Room();
    newOwner.name = "data";
    newOwner.id = "data";
    newOwner.token = "data";
    newOwner.email = "data";


    newOwner.save(function(err){
      if(err) return handleError(err);
      page.findById(newOwner, function(err, doc){
        if(err) return handleError(err);
        console.log(doc);
      })
    });

    newRoom.owner = newOwner;
*/
  /*newRoom.code = Date.now();

    newRoom.save(function(err){
      if(err) return handleError(err);
      page.findById(newRoom, function(err, doc){
        if(err) return handleError(err);
        console.log(doc);
      })
    });
*/
    //console.log(req.body.name);
    console.log(req.body.timestamp);
    res.redirect('/room');

  });

};

var handleError= function(err){
  console.log("you effed up");
}
