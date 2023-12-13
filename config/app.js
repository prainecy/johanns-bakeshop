// Import required modules for your Node.js and Express application
let createError = require('http-errors'); // To create HTTP errors
let express = require('express'); // Express web framework
const session = require('express-session');
let path = require('path'); // For working with file paths
let cookieParser = require('cookie-parser'); // For parsing cookies
let logger = require('morgan'); // Middleware for request logging
const MongoStore = require('connect-mongo');

// Import "mongoose" for Database Access
let mongoose = require('mongoose');
// Define the URI for the database
let DB = require('./db');

// Connect to the MongoDB database using Mongoose
mongoose.connect(process.env.URI || DB.URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Get a reference to the MongoDB connection
let mongoDB = mongoose.connection;

// Handle MongoDB connection events
mongoDB.on('error', console.error.bind(console, 'Connection Error:'));
mongoDB.once('open', () => {
  console.log("Connected to MongoDB...");
});


let indexRouter = require('../routes/index');
let app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs'); // express  -e

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: 'mongodb+srv://elimain:Hotdog12345@grandline.7w2wul6.mongodb.net/JohannS',
    collectionName: 'sessions'
  }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hours
}));

// Middleware to set isLoggedIn for all routes
app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn; // set isLoggedIn in the response locals
  next();
});


app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../node_modules')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { title: 'Error'});
});

module.exports = app;
