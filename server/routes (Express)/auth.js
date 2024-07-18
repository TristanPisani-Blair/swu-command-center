const express = require('express');
const passport = require('passport');
const router = express.Router();
const { saveUser } = require('../controllers/userController');

require('../config/auth');

router.get('/login', passport.authenticate('auth0', {
  scope: 'openid email profile'
}), (req, res) => {
  res.redirect('/');
});

router.get('/callback', passport.authenticate('auth0', {
  failureRedirect: '/'
}), async (req, res) => {
  await saveUser(req.user);
  res.redirect('/user');
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/user', (req, res) => {
  res.send(req.user);
});

module.exports = router;
