const User = require('../models/userModel').User
const Post = require('../models/postModel').Post
const bcrypt = require('bcryptjs')
const {
  isEmpty
} = require('../config/customFunctions')
const ObjectId = require('mongoose').Types.ObjectId

module.exports = {
  getAuthorsPage: async (req, res) => {
    const authors = await User.find()
    Post.find().then(posts => {
      res.render('admin/author/index', {
        title: 'All Authors',
        posts: posts,
        authors: authors
      })
    })
  },
  getAddAuthorPage: (req, res) => {
    res.render('admin/author/add',        { title: 'Add Author',}
)
  },
  addAuthour: (req, res) => {
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const username = req.body.username
    const password = req.body.password
    const role = req.body.role
    const email = req.body.email
    const bio = req.body.bio

    let filename = ''

    if (!isEmpty(req.files)) {
      let file = req.files.uploadedFile
      filename = file.name
      let uploadDir = './public/uploads/users/'
      file.mv(uploadDir + filename, err => {
        if (err) throw err
      })
    }
    const newUser = new User({
      firstName: firstName,
      lastName: lastName,
      username: username,
      email: email,
      password: password,
      role: role,
      bio: bio,
      file: `/uploads/users/${filename}`
    })

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        newUser.password = hash
        newUser.save().then(savedUser => {
          req.flash('success_message', ` User created succesfully`)
          res.redirect('/dashboard/authors')
        })
      })
    })

  },
  getEditAuthorPage: (req, res) => {
    const id = req.params.id
    const $or = [{
      username: id
    }]

    if (ObjectId.isValid(id)) {
      $or.push({
        _id: ObjectId(id)
      })
    }
    User.findOne({
      $or: $or
    }).then(user => {
      res.render('admin/author/edit', {
                title: 'Edit Author',

        user: user
      })
    })
  },
  editAuthor: (req, res) => {
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const username = req.body.username
    const email = req.body.email
    const bio = req.body.bio

    let filename = ''

    if (!isEmpty(req.files)) {
      let file = req.files.uploadedFile
      filename = file.name
      let uploadDir = './public/uploads/users/'
      file.mv(uploadDir + filename, err => {
        if (err) throw err
      })
    }
    const id = req.params.id
    const $or = [{
      username: id
    }]

    if (ObjectId.isValid(id)) {
      $or.push({
        _id: ObjectId(id)
      })
    }
    User.findOne({
      $or: $or
    }).then(author => {
      author.firstName = firstName
      author.lastName = lastName
      author.username = username
      author.email = email
      author.bio = bio
      author.file = `/uploads/users/${filename}`

      author.save().then(updateProfile => {
        req.flash('success_message', `Author Profile Has Been Updated`)
        res.redirect('/dashboard/authors')
      })
    })
  },
  deleteAuthor: (req, res) => {
    const id = req.params.id
    User.findByIdAndDelete(id).then(user => {
      res.redirect('/dashboard/authors')
    })
  }
}