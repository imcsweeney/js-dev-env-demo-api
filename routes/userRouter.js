/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */

const express = require('express');
const path = require('path');
// var User = require('../models/user');

function routes(User) {
  const userRouter = express.Router();
  userRouter.route('/')
    .get((req, res) => res.sendFile(path.join(__dirname, '../templateLogReg/index.html')))
    // eslint-disable-next-line consistent-return
    .post((req, res, next) => {
      if (req.body.password !== req.body.passwordConf) {
        const err = new Error('Passwords do not match.');
        err.status = 400;
        res.send('passwords dont match');
        return next(err);
      }

      if (req.body.email
        && req.body.username
        && req.body.password
        && req.body.passwordConf) {
        const userData = {
          email: req.body.email,
          username: req.body.username,
          password: req.body.password,
        };

        User.create(userData, (error, user) => {
          if (error) {
            return next(error);
          }
          req.session.userId = user._id;
          return res.redirect('/profile');
        });
      } else if (req.body.logemail && req.body.logpassword) {
        User.authenticate(req.body.logemail, req.body.logpassword, (error, user) => {
          if (error || !user) {
            const err = new Error('Wrong email or password.');
            err.status = 401;
            return next(err);
          }
          req.session.userId = user._id;
          return res.redirect('/profile');
        });
      } else {
        const err = new Error('All fields required.');
        err.status = 400;
        return next(err);
      }
    });
  userRouter.route('/profile')
    .get((req, res, next) => {
      User.findById(req.session.userId)
        .exec((error, user) => {
          if (error) {
            return next(error);
          }
          if (user === null) {
            const err = new Error('oops, you\'re not authorized...sorry');
            err.status = 400;
            return next(err);
          }
          return res.send(`<h1>Name: </h1>hello ${user.username}, welcome to the earth. rememeber don't fuck with the peaky blinders<h2>Mail: </h2>${user.email}<br><a type="button" href="/logout">Logout</a>`);
        });
    });
  userRouter.route('/logout')
    .get((req, res, next) => {
      if (req.session) {
        // delete session object
        req.session.destroy((err) => {
          if (err) {
            return next(err);
          }
          return res.redirect('/');
        });
      }
    });
  return userRouter;
}


module.exports = routes;
