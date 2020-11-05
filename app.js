var express = require('express');
var path = require('path');
var dotenv = require('dotenv');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var handlebars = require('handlebars');
var hbs = require('express-handlebars');
var hbshelpers = require('handlebars-helpers');
var multihelpers = hbshelpers();
var { DateTime } = require('luxon');

dotenv.config();

var mongoose = require('mongoose');
var mongoDB = `mongodb+srv://${process.env.MONGODBUSER}:${process.env.MONGODBPW}@${process.env.MONGODBCLUSTER}/${process.env.MONGODBDB}?retryWrites=true&w=majority`;
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var index = require('./routes/index');
var users = require('./routes/users');
var catalog = require('./routes/catalog');

var app = express();

// view engine setup
app.engine(
  "hbs",
  hbs({
    helpers: multihelpers,
    partialsDir: ["views/partials"],
    extname: ".hbs",
    layoutsDir: "views",
    defaultLayout: "layout"
  })
);
app.set('view engine', 'hbs');

handlebars.registerHelper('url', function(id, category) {
  return '/catalog/' + category + '/' + id;
});

handlebars.registerHelper('dateformat', function(dt) {
  return DateTime.fromJSDate(dt).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY);
});

handlebars.registerHelper('lifespan', function(birth, death) {
  if (!birth) return;
  const deathYear = death ? death.getFullYear() : new Date().getFullYear();
  const deathString = death ? DateTime.fromJSDate(death).toFormat('MMMM yyyy') : 'present';
  return ', ' + (deathYear - birth.getFullYear()) + ', ' + DateTime.fromJSDate(birth).toFormat('MMMM yyyy') + ' - ' + deathString;
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/catalog', catalog);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
