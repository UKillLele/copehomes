const express = require('express');
const router = express.Router();

const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');

router.post('/enroll', checkAuth, (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        username: req.body.username,
        password: hash,
        type: req.body.type
    });
    user.save()
      .then(result => {
        res.status(201).json({
          message: 'User created!',
          result: result
        });
      })
      .catch(err => {
        res.status(500).json ({
          error: err
        });
      });
  });
});

router.post('/login', (req, res, next) => {
  let fetchedUser;
  User.findOne({username: req.body.username})
    .then( user => {
      if(!user) {
        return res.status(401).json ({
          message: 'Authorization failed.'
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json ({
          message: 'Authorization failed.'
        });
      }
      const token = jwt.sign(
        {username: fetchedUser.username, userId: fetchedUser._id},
        'super_secret_secret_message',
        {expiresIn:'1h'}
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600
      });
    })
    .catch(err => {
      return res.status(401).json ({
        message: 'Authorization failed.'
      });
    });
});

router.get('', (req, res, next) => {
  User.find()
    .then(documents => {
      res.status(200).json({
        message: 'Users fetched successfully!',
        users: documents
      });;
    });
});

router.delete('/:username', checkAuth, (req, res, next) => {
  User.deleteOne({username: req.params.username}).then(result => {
    console.log(result);
    res.status(200).json({message: 'User deleted!'});
  });
});

module.exports = router;
