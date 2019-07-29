var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const dotenv = require('dotenv').config();
//console.log(process.env.PGUSER);
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var { executeSelect, executeInsert } = require('./dbQuery.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


const { Pool, Client } = require('pg')
// pools will use environment variables
// for connection information
const pool = new Pool();

app.get('/get', function (req, res) {
  /*
  //Using  promises
  let query = 'select *from tbl_students';
  executeSelect(query).then(result => {
    console.log(result);
    res.send(result);
  })
    .catch(e => {
      throw e;
    });
  */

  //Using Async/await
  (async () => {
    let query = 'select *from tbl_students';
    try {
      const result = await executeSelect(query);
      res.send(result);
    } finally {
      //client.release();
    }
  }
  )().catch(e => console.log(e.stack))

});

app.get('/insert', function (req, res) {

    //Using Async/await
    (async () => {
      const query = {
        text: 'INSERT INTO tbl_students(first_name,last_name,class) VALUES($1,$2,$3) RETURNING *',
        values: ['San', 'Test', 'Class 11'],
      }
      try {
        const result = await executeInsert(query);
        console.log(result);
        res.send(result);
      } finally {
        //client.release();
      }
    }
    )().catch(e => console.log(e.stack))
});

/*
app.use('/', indexRouter);
app.use('/users', usersRouter);
*/

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
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
