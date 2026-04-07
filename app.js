var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/thuvienso')
  .then(() => {
    console.log("✅ Đã kết nối thành công với MongoDB (Database: thuvienso)!");
  })
  .catch((err) => {
    console.log("❌ Lỗi kết nối MongoDB. Bạn đã mở MongoDB Compass chưa?");
    console.log("Chi tiết lỗi:", err);
  });
// -------------------------------------------------------------

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var categoriesRouter = require('./routes/categories');
var booksRouter = require('./routes/books');
var authorsRouter = require('./routes/authors');
var publishersRouter = require('./routes/publishers');
var authRouter = require('./routes/auth');
var uploadRouter = require('./routes/upload');
var reviewsRouter = require('./routes/reviews');
var borrowRecordsRouter = require('./routes/borrowRecords');
var ebookFilesRouter = require('./routes/ebookFiles');
var cors = require('cors');
var wishlistsRouter = require('./routes/wishlists');
var notificationsRouter = require('./routes/notifications');
var cartsRouter = require('./routes/carts');
var messagesRouter = require('./routes/messages');
var postsRouter = require('./routes/posts');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// Đăng ký các đường dẫn (Routes)
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/categories', categoriesRouter);
app.use('/books', booksRouter);
app.use('/authors', authorsRouter);
app.use('/publishers', publishersRouter);
app.use('/auth', authRouter);
app.use('/upload', uploadRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/reviews', reviewsRouter);
app.use('/borrow-records', borrowRecordsRouter);
app.use('/ebook-files', ebookFilesRouter);
app.use('/wishlists', wishlistsRouter);
app.use('/notifications', notificationsRouter);
app.use('/carts', cartsRouter);
app.use('/messages', messagesRouter);
app.use('/posts', postsRouter);


app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

console.log("Server Node.js đang chuẩn bị khởi động...");
module.exports = app;