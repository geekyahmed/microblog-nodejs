require('dotenv').config()
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const User = require('../models/userModel').User
const Token = require('../models/tokenModel').Token

module.exports = {

  getRegisterUser: (req, res) => {
    res.render('index/register');
  },

  registerUser: (req, res) => {
    let errors = []

    if (!req.body.firstName) {
      errors.push({
        message: 'First name is mandatory'
      })
    }
    if (!req.body.lastName) {
      errors.push({
        message: 'Last name is mandatory'
      })
    }
    if (!req.body.email) {
      errors.push({
        message: 'Email field is mandatory'
      })
    }
    if (!req.body.password || !req.body.passwordConfirm) {
      errors.push({
        message: 'Password field is mandatory'
      })
    }
    if (req.body.password !== req.body.passwordConfirm) {
      errors.push({
        message: 'Passwords do not match'
      })
    }

    if (errors.length > 0) {
      res.render('index/register', {
        errors: errors,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
      })
    } else {
      User.findOne({
        email: req.body.email
      }).then(user => {
          if (user) {
            req.flash('error-message', 'Email already exists, try to login.')
            res.redirect('/login')
          } else {
            const newUser = new User(req.body)

            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                newUser.password = hash
                newUser.save().then(user => {

res.redirect('/login')
                })
              })
            })
      }
    })
}
},

verifyUser: (req, res) => {
    Token.findOne({
        token: req.body.token
      },
      token => {
        if (!token) {
          return res.status(400).send({
            type: 'not-verified',
            msg: 'Unable to find a valid token'
          })
        } else {
          User.findOne({
              _id: token._userId,
              email: req.body.email
            },
            user => {
              if (!user) {
                return res.status(400).send({
                  msg: 'Unable to find a user for this token'
                })
              }
              if (user.isVerified) {
                return res.status(400).send({
                  type: 'already-verified',
                  msg: 'This user has been verified'
                })
              } else {
                isVerified = true
                user.save(err => {
                  if (err) {
                    return res.status(500).send({
                      msg: err.message
                    })
                  } else {
                    res.status(200).send({
                      msg: 'The account has been verified'
                    })
                  }
                })
              }
            }
          )
        }
      }
    )
  },

  getLoginUser: (req, res) => {
    res.render('index/login', {
      message: req.flash('error')
    });
  },

  loginUser: (req, res, next) => {
    next()
  },

}