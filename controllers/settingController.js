const User = require('../models/userModel').User
const ObjectId = require('mongoose').Types.ObjectId
const Setting = require('../models/settingModel').Setting
const Category = require('../models/categoryModel').Category
const { isEmpty } = require('../config/customFunctions')

module.exports = {
  getBlogSettings: (req, res) => {
    
        res.render('admin/blog/index')
  },

   submitBlogSetting: (req, res) => {
    // Check for any input file
    let filename = ''

    if (!isEmpty(req.files)) {
      let file = req.files.uploadedFile
      filename = file.name
      let uploadDir = './public/uploads/'
      file.mv(uploadDir + filename, err => {
        if (err) throw err
      })
    }

    const newSetting = new Setting({
      title: req.body.title,
      description: req.body.description,
      tagline: req.body.tagline,

      file: `/uploads/${filename}`
    })

    newSetting.save().then(setting => {
      req.flash('success-message',` Blog created successfully.`)
      res.redirect('/dashboard/settings')
    })
  },
}
