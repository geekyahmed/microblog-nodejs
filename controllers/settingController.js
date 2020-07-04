const User = require('../models/userModel').User
const ObjectId = require('mongoose').Types.ObjectId
const Setting = require('../models/settingModel').Setting
const Category = require('../models/categoryModel').Category
const {
  isEmpty
} = require('../config/customFunctions')

module.exports = {
  getBlogSettings: (req, res) => {
    Setting.findOne()
      .then(setting => {
        res.render('admin/settings/index', {
                  title: 'Settings',

          setting: setting
        })
      })

  },

  submitBlogSetting: (req, res) => {
    let filename = ''

    if (!isEmpty(req.files)) {
      let file = req.files.uploadedFile
      filename = file.name
      let uploadDir = './public/uploads/'
      file.mv(uploadDir + filename, err => {
        if (err) throw err
      })
    }
    Setting.findOne()
      .then(setting => {
        setting.title = req.body.title,
          setting.description = req.body.description,
          setting.tagline = req.body.tagline,
          setting.file = `/uploads/${filename}`

        setting.save().then(savedSetting => {
          res.redirect('/dashboard/settings')
        })
      })
  },
}