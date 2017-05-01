var express = require('express');
var router = express.Router();
var User = require('../models/user.model');
var userGame = require('../models/userGame.model');
var passport = require('passport');
var generator = require('generate-password');
const nodemailer = require('nodemailer');

router.route('/forgot')
  .post(function(req, res, next) {

    var email = req.body.email;

    var password = generator.generate({
        length: 10,
        numbers: true
    });

    User.findOne({'local.email': email}, function(err, user, info) {
      user.local.password = user.generateHash(password);
      user.save(function(err) {
        if (err)
          throw err;
      });
    });

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'planszowkarz@gmail.com',
            pass: '123456789ABC'
        }
    });

    let mailOptions = {
        from: '"Planszówkarz" <planszowkarz@gmail.com>',
        to: email,
        subject: 'Resetowanie hasła',
        text: 'Nowe hasło: ' + password,
        html: 'Nowe hasło: <b>' + password + '</b>'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });
  });

// =====================================
// FACEBOOK ROUTES =====================
// =====================================

router.route('/auth/facebook')
  .get(function(req, res, next) {
    passport.authenticate('facebook', {
      scope: 'email'
    })(req, res, next);
  });

router.route('/auth/facebook/callback')
  .get(function(req, res, next) {
    // passport.authenticate('facebook', {
    // 	successRedirect : '/user-game,
    // 	failureRedirect : '/register',
    // })(req, res, next);
    passport.authenticate('facebook', function(err, user, info) {
      if (err) { return next(err) }
      if (!user) { return res.json( { message: info.message }) }
      res.json({user: user});
    })(req, res, next);
  });

// =====================================
// LOCAL ROUTES ========================
// =====================================

/* REGISTER */

router.route('/users/register')
  .post(function(req, res, next) {
    passport.authenticate('local-register', function(err, user, info) {
      if (err) { return next(err) }
      if (!user) { return res.json( { message: info.message }) }
      res.json({user: user});
    })(req, res, next);
  });

/* LOGIN */

router.route('/users/login')
  .post(function(req, res, next) {
    passport.authenticate('local-login', function(err, user, info) {
      if (err) { return next(err) }
      if (!user) { return res.json( { message: info.message }) }
      res.json({user: user});
    })(req, res, next);

  });

/* LOGOUT */

router.route('/users/logout')
  .post(function(req, res, next) {
    req.logout();
  })

// =====================================
// DEFAULT ROUTES =====================
// =====================================

router.route('/users')
  // get all users
  .get((req, res) => {
    User.find((err, users) => {
      if (err) {
        return res.status(400).json({
          message: "Bad Requested"
        });
      } else {
        return res.status(200).json({
          users: users
        });
      }
    });
  })
  // post new user
  .post((req, res) => {
    if (!req.body.login || !req.body.password) {
      return res.status(401).end({
        message: "You must pass login/password"
      });
    } else {
      var newUser = new User({
        login: req.body.login,
        password: req.body.password,
        nameame: req.body.name,
        email: req.body.email
      });
      // save the user
      newUser.save((err) => {
        if (err) {
          return res.status(409).json({
            message: 'Wrong user'
          });
        } else {
          return res.status(201).json(newUser);
        }
      });
    }
  });

router.route('/users/:id')
  .get((req, res) => {
    User.findById(req.params.id, (err, user) => {
      if (err) {
        return res.status(400).json({
          message: "Bad Requested"
        });
      } else if (!user) {
        return res.status(404).json({
          message: "User not Found"
        });
      } else {
        return res.status(200).json(user);
      }
    });
  })

  .patch((req, res) => {
    if (!req.body.password) {
      return res.status(401).json({
        message: "You haven't entered a password."
      });
    }

    User.findByIdAndUpdate({
      _id: req.params.id
    }, req.body, (err, user) => {
      if (err) {
        return res.status(400).json({
          message: "Bad Requested"
        });
      } else if (!user) {
        return res.status(404).json({
          message: "User not Found"
        });
      } else {
        return res.status(200).json({
          user
        });
      }
    });
  })

  .delete(function(req, res) {
    User.findById(req.params.id, (err, user) => {
      if (err) {
        return res.status(400).json({
          message: "Bad Requested"
        });
      } else if (!user) {
        return res.status(404).json({
          message: "User not Found"
        });
      } else {
        User.remove({
          _id: req.params.id
        }, (err, user) => {
          if (err) {
            return res.status(400).json({
              message: "Bad Requested"
            });
          } else {
            return res.status(204).end();
          }
        });
      }
    })
  });

router.route('/users/:id/userGames')
  .get((req, res) => {
    userGame.find({
      userID: req.params.id
    }, (err, game) => {
      if (err) {
        return res.status(400).json({
          message: "Bad Requested"
        });
      } else if (!game) {
        return res.status(404).json({
          message: "Games not Found"
        });
      } else {
        return res.status(200).json(game);
      }
    });
  });


module.exports = router;
