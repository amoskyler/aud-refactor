
var express = require('express');
var app = express();
var http = require('http');
var bodyParser = require('body-parser')
var port = process.env.PORT || 5000;
var mongoose = require('mongoose');
var configDB = require('./config/database.js');
var jade = require('jade');

mongoose.connect(configDB.url);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.set('view engine', 'jade');

require('./app/routes.js')(app);

app.listen(port);
console.log("Server started on port " + port);


server = http.createServer(app.listen)
