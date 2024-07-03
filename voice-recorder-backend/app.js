// var createError = require('http-errors');
// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');
//
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
//
// var app = express();
//
// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
//
// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
//
// app.use('/', indexRouter);
// app.use('/users', usersRouter);
//
// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });
//
// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });
//
// module.exports = app;
const express = require('express');
const multer = require('multer');
const { transcribeAudio } = require('./transcribe');
const { saveNote, getNotes } = require('./database');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const upload = multer({ dest: 'uploads/' });

mongoose.connect('mongodb+srv://shauryaryann:Street16%40%40@cluster0.jbfcntv.mongodb.net/voice_notes?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(express.json());

app.post('/upload', upload.single('audio'), async (req, res) => {
  const transcript = await transcribeAudio(req.file.path);
  const note = await saveNote({ text: transcript });
  res.json(note);
});

app.get('/notes', async (req, res) => {
  const notes = await getNotes();
  res.json(notes);
});

app.listen(3000, () => console.log('Server running on port 3000'));

