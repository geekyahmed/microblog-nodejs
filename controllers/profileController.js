const User = require('../models/userModel').User
const { isEmpty } = require('../config/customFunctions')
const ObjectId = require('mongoose').Types.ObjectId
const htmlToText = require('html-to-text')


module.exports = {
  getProfile: (req, res) => {
    res.render('admin/profile/index', {        title: 'Profile',
})
  },
  updateProfile: (req, res) => {
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const username = req.body.username
    const email = req.body.email
    const bio = htmlToText.fromString(req.body.bio);

    let filename = ''

    if (!isEmpty(req.files)) {
      let file = req.files.uploadedFile
      filename = file.name
      let uploadDir = './public/uploads/users/'
      file.mv(uploadDir + filename, err => {
        if (err) throw err
      })
    }
    User.findOne({ email: req.user.email }).then(user => {
      user.firstName = firstName
      user.lastName = lastName
      user.username = username
      user.email = email
      user.bio = bio
      user.file = `/uploads/users/${filename}`

      user.save().then(updateProfile => {
        req.flash('success_message', `Your Profile Has Been Updated`)
        res.redirect('/dashboard')
      })
    })
  }
}
