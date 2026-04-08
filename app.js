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
var booksRouter = require('./routes/books');
var categoriesRouter = require('./routes/categories');
var authorsRouter = require('./routes/authors');
var publishersRouter = require('./routes/publishers');
var reviewsRouter = require('./routes/reviews');
var postsRouter = require('./routes/posts');
var borrowRecordsRouter = require('./routes/borrowRecords');
var cartsRouter = require('./routes/carts');
var notificationsRouter = require('./routes/notifications');
var messagesRouter = require('./routes/messages');
var ebookFilesRouter = require('./routes/ebookFiles');
var wishlistsRouter = require('./routes/wishlists');

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

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);

// Định tuyến cho tất cả các yêu cầu khác, trả về index.html để React Router xử lý

app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/roles', require('./routes/roles'));
app.use('/api/v1/auth', require('./routes/auth'));

app.use('/api/v1/books', require('./routes/books'));
app.use('/api/v1/categories', require('./routes/categories'));
app.use('/api/v1/authors', require('./routes/authors'));
app.use('/api/v1/publishers', require('./routes/publishers'));
app.use('/api/v1/reviews', require('./routes/reviews'));
app.use('/api/v1/posts', require('./routes/posts'));
app.use('/api/v1/borrowRecords', require('./routes/borrowRecords'));
app.use('/api/v1/carts', require('./routes/carts'));
app.use('/api/v1/notifications', require('./routes/notifications'));
app.use('/api/v1/messages', require('./routes/messages'));
app.use('/api/v1/ebookFiles', require('./routes/ebookFiles'));
app.use('/api/v1/wishlists', require('./routes/wishlists'));
app.use('/api/v1/upload', require('./routes/upload'));






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
