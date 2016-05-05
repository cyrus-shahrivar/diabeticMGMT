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
