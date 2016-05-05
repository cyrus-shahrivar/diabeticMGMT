var express = require('express');
var logger = require('morgan');
var request = require('request');
var app = express();
var pg = require('pg');
var router = express.Router();
var Sequelize = require('sequelize');
var sequelize = new Sequelize('postgres://localhost:5432/diabetes1');

// console output for debugging
app.use(logger('dev'));

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

// schema
var User = sequelize.define('user', {
  firstName: {
    type: Sequelize.STRING,
    field: 'first_name' // Will result in an attribute that is firstName when user facing but first_name in the database
  },
  lastName: {
    type: Sequelize.STRING
  }
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

User.create({
    firstName: 'John',
    lastName: 'Hancock'
});

User.create({
    firstName: 'Cyrus',
    lastName: 'Hancock'
});



User.findOne().then(function (user) {
    console.log(user.get('lastName'));
});
