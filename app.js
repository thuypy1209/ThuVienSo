var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors'); // Thêm cors để xử lý CORS

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var rolesRouter = require('./routes/roles');
var authRouter = require('./routes/auth');
require('dotenv').config();

var mongoose = require('mongoose');

// Kết nối tới MongoDB (Database tên là: thuvienso)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log(" Đã kết nối thành công với MongoDB (Database: thuvienso)!");
  })
  .catch((err) => {
    console.log(" Lỗi kết nối MongoDB:", err.message);
    console.log("Chi tiết lỗi:", err);
  });
mongoose.connection.on('connected',()=>{
  console.log("connected");
})
mongoose.connection.on('disconnected',()=>{
  console.log("disconnected");
})

var app = express();

app.use(cors()); // Sử dụng CORS cho tất cả các route
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);

// Định tuyến cho tất cả các yêu cầu khác, trả về index.html để React Router xử lý
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
=======
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/roles', require('./routes/roles'));
app.use('/api/v1/auth', require('./routes/auth'));



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
