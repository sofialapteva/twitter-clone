// modules//
const express = require('express');
const session = require('express-session');
require('dotenv').config();
const mongoose = require('mongoose');
require('filestack-js').init('AEU1BtQQVQBOOVeFKP4XZz');
const MongoStore = require('connect-mongo')(session);
// imports//
const indexRouter = require('./routes/index');
const accountRouter = require('./routes/account');
// mongoose
const uri = process.env.URI || 'mongodb://localhost:27017/quacker';
mongoose.connect(uri, {
  useFindAndModify: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// server
const app = express();
// middlewares//
app.set('views', 'views');
app.set('view engine', 'hbs');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    key: 'quacker',
    store: new MongoStore({
      mongooseConnection: mongoose.createConnection(uri, {
        useFindAndModify: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      }),
    }),
    resave: false,
    saveUninitialized: false,
    secret: process.env.SECRET || 'ns983Md7b27bys7c73bd8BJ8sb28',
    cookie: { secure: false },
  }),
);

app.use((req, res, next) => {
  res.locals.username = req.session?.username;
  res.locals.userId = req.session?.userId;
  next();
});

app.use('/', indexRouter);
app.use('/account', accountRouter);

const port = process.env.PORT || 3000;
app.listen(port);
