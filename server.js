var express = require('express');
var logger = require('morgan');
var request = require('request');
var app = express();

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
