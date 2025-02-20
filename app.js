var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const jwt = require("jsonwebtoken")
const cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const productsRouter = require("./routes/products")
const categoriesRouter = require("./routes/categories")
const cartsRouter = require("./routes/cart")

var app = express();

// CORS setup
app.use(cors("*"));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/products", productsRouter);
app.use("/categories", categoriesRouter);
app.use("/cart", cartsRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// token config

function verifyToken(req,res,next){
  jwt.verify(req.headers["x-access-token"], "node2022", function(err, decoded){
    if(err){
      res.json({message:err.message})
    }else{
      console.log(decoded)
      next()
    }
  })
}
app.verifyToken = verifyToken
 
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
