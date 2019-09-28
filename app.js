var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');

var app = express();

const db = {
  host: process.env.vregression_db_host,
  database: process.env.vregression_db_name,
  password: process.env.vregression_db_pass,
  user: process.env.vregression_db_user,
  port: process.env.vregression_db_port
}

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 'extended': 'false' }));
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/api/books', express.static(path.join(__dirname, 'dist')));
app.use('/api/cypress-test', require('./api/routes/cypress-test'));

// Mongoose configuration
mongoose.Promise = require('bluebird');
mongoose.connect(`mongodb://${db.user}:${db.password}@${db.host}:${db.port}/${db.database}`, { useNewUrlParser: true, promiseLibrary: require('bluebird') })
  .then(() => console.log('connection to ' + db.database + ' succesful'))
  .catch((err) => console.error(err));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
