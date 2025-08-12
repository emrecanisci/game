const express = require('express');
const router = express.Router();
const { createUser, findUserByUsername } = require('../models/User');
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

router.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});

router.post('/register', (req, res) => {
  const { username, password } = req.body;
  createUser(username, password, (err) => {
    if (err) {
      req.flash('error', 'Username already exists or invalid.');
      return res.redirect('/register');
    }
    req.flash('success', 'Registration successful. Please log in.');
    res.redirect('/login');
  });
});

router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  findUserByUsername(username, (err, user) => {
    if (err || !user) {
      req.flash('error', 'Invalid username.');
      return res.redirect('/login');
    }
    bcrypt.compare(password, user.password, (err, match) => {
      if (match) {
        req.session.user = { id: user.id, username: user.username };
        res.redirect('/game/roulette');
      } else {
        req.flash('error', 'Incorrect password.');
        res.redirect('/login');
      }
    });
  });
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
