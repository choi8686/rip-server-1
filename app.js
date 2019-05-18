var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sequelize = require('./models').sequelize;
var passportConfig = require('./passport')
var session = require('express-session')
var bodyParser = require('body-parser')

require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var toiletRouter = require('./routes/toilet');
var commentsRouter = require('./routes/comments');
var app = express();
sequelize.sync();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  resave: false, 
  saveUninitialized: true,
  secret: process.env.COOKIE_SECRET
}))

var passport = require('passport');


app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/toilet', toiletRouter);
app.use('/comments', commentsRouter);

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
  res.render('error');
}); 

module.exports = app;
