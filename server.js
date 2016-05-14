var express = require('express');
var logger = require('morgan');
var request = require('request');
var app = express();
var pg = require('pg');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var User = require("./models/user");

mongoose.connect('mongodb://localhost/diabetes1', function (err) {
  if(err){
    console.log(err);
  } else {
    console.log('database connection successful');
  }
});

// console output for debugging
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('port', (process.env.PORT || 5000));

// serve the public folder's static assets by default
app.use(express.static(__dirname + '/public'));
app.get('/', function(request, response) {
  response.render('public/index.html');
});

// message on nodemon to verify server is up
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

app.get('/users', function(req,res){
  User.find().exec(function (err, users) {
    res.send(JSON.stringify(users));
  });
});


app.get('/past1week', function(req,res){
  // "2016-02-08T09:24:00Z" format needed
  var now = new Date();
  var oneWeekAgo = new Date();
  oneWeekAgo = oneWeekAgo.setDate(now.getDate()-7);
  now = now.toISOString();
  oneWeekAgo = new Date(oneWeekAgo);
  oneWeekAgo = oneWeekAgo.toISOString();
  User.find().where("updated_at").gt(oneWeekAgo).lt(now).exec(function (err, users) {
    res.send(JSON.stringify(users));
  });
});

app.get('/past2weeks', function(req,res){
  // "2016-02-08T09:24:00Z" format needed
  var now = new Date();
  var twoWeeksAgo = new Date();
  twoWeeksAgo = twoWeeksAgo.setDate(now.getDate()-14);
  now = now.toISOString();
  twoWeeksAgo = new Date(twoWeeksAgo);
  twoWeeksAgo = twoWeeksAgo.toISOString();
  User.find().where("updated_at").gt(twoWeeksAgo).lt(now).exec(function (err, users) {
    res.send(JSON.stringify(users));
  });
});

//creates a new user
app.post('/users', function (req, res) {
  var user = new User(req.body);
  console.log(req.body);
  user.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log('User saved');
      res.send(user);
    }
  });
});
