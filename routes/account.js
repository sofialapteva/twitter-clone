const express = require('express');
const router = express.Router();
const sha256 = require('sha256')
const User = require('../models/user')

//регистрация
router.route('/register').get((req, res) => {
  if (req.session?.userId) {
    res.redirect('/');
  } else {
    res.render('register');
  }
}).post(async (req, res) => {
  let newUser = await User.findOne({ email: req.body.email });
  if (newUser) {
    res.render('register', { error: 'Для данного email уже существует аккаунт, попробуйте войти' })
  } else {
    newUser = new User({
      email: req.body.email,
      username: req.body.username,
      password: sha256(req.body.password)
    })
    await newUser.save()
    req.session.username = newUser.username;
    req.session.userId = newUser._id;
    res.redirect('/')
  }
})

router.route('/login').get((req, res) => {
  if (req.session?.userId) {
    res.redirect('/');
  } else {
    res.render('login');
  }
}).post(async (req, res) => {
  let newUser = await User.findOne({ email: req.body.email, password: sha256(req.body.password) });
  if (newUser) {
    req.session.username = newUser.username;
    req.session.userId = newUser._id;
    res.redirect('/')
  } else {
    res.render('login', { error: 'Неправильный логин или пароль' })
  }
})


module.exports = router;
