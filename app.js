/* eslint-disable no-console */
const express =  require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
// const path = require('path');

const app = express();
app.use(cors());

let db = {};

if (process.env.ENV === 'Test') {
  console.log('TESTING...connecting to the test DB');
  db = mongoose.connect('mongodb://localhost/bookAPI_Test');
} else {
  console.log('THINK FIRST...connecting to the production DB');
  db = mongoose.connect('mongodb://localhost/bookAPI');
}
db = mongoose.connection;
// handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('connection established successfully!');
});

const port = process.env.PORT || 4000;
const User = require('./models/user');
const userRouter = require('./routes/userRouter')(User);

// use sessions for tracking logins
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', userRouter);

app.get('/users', function(req, res) {
    // Hard coding for simplicity. Pretend this hits a real database
    res.json([
      {"id": 1,"firstName":"Bob","lastName":"Smith","email":"bob@gmail.com"},
      {"id": 2,"firstName":"Tammy","lastName":"Norton","email":"tnorton@yahoo.com"},
      {"id": 3,"firstName":"Tina","lastName":"Lee","email":"lee.tina@hotmail.com"}
    ]);
  });

app.server = app.listen(port, () => {
  console.log(`running on port ${port}`);
});
module.exports = app;
//////////////

// app.set('port', (process.env.PORT || 5000));

// app.get('/', function(request, response) {
//   response.send('Hello World!')
// });

// app.get('/users', function(req, res) {
//   // Hard coding for simplicity. Pretend this hits a real database
//   res.json([
//     {"id": 1,"firstName":"Bob","lastName":"Smith","email":"bob@gmail.com"},
//     {"id": 2,"firstName":"Tammy","lastName":"Norton","email":"tnorton@yahoo.com"},
//     {"id": 3,"firstName":"Tina","lastName":"Lee","email":"lee.tina@hotmail.com"}
//   ]);
// });

// app.listen(app.get('port'), function() {
//   console.log("Node app is running at localhost:" + app.get('port')); 
// });
