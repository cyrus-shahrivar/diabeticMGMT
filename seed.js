var User = require('./models/user.js'),
    mongoose = require('mongoose');

//connect to mongo database
mongoose.connect('mongodb://localhost/diabetes1', function (err) {
  if(err){
    console.log(err);
  } else {
    console.log('seed connection successful');
  }
});

var arrayOfUsers = [{
    username: "Cyrus",
    created_at: "2016-05-13T09:24:00Z",
    updated_at: "2016-05-13T09:24:00Z",
    bg: 100
  },
  {
    username: "Cyrus",
    created_at: "2016-05-13T09:24:00Z",
    updated_at: "2016-05-13T09:24:00Z",
    bg: 140
  }
];

User.collection.insert(arrayOfUsers, onUsersInsert);
function onUsersInsert(err, docs) {
  if (err) {
      console.log(err);
  } else {
      console.info('users seed was successfully stored.', docs.length);
  }
}
