const Post = require('../models/postModel').Post
const Category = require('../models/categoryModel').Category
const ObjectId = require('mongoose').Types.ObjectId
const Comment = require('../models/commentModel').Comment

module.exports = {
  /* ALL CATEGORY METHODS*/
  getCategories: (req, res) => {
    Category.find()
      .populate('author')
      .then(cats => {
        res.render('admin/category/index', {
          categories: cats
        })
      })
  },

  createCategories: (req, res) => {
    const title = req.body.title
    const slug = req.body.slug
    const author = req.user._id

    const newCategory = new Category({
      author: author,
      title: title,
      slug: slug
    })

    newCategory.save().then(category => {
      res.redirect('/dashboard/categories')
    })
  },

  getEditCategoriesPage: async (req, res) => {
    const id = req.params.id
    const $or = [{ slug: id }]

    if (ObjectId.isValid(id)) {
      $or.push({ _id: ObjectId(id) })
    }

    const cats = await Category.find()

    Category.findOne({
      $or: $or
    }).then(cat => {
      res.render('admin/category/edit', {
        category: cat,
        categories: cats
      })
    })
  },

  submitEditCategoriesPage: (req, res) => {
const id = req.params.id
const $or = [{ slug: id }]

if (ObjectId.isValid(id)) {
  $or.push({ _id: ObjectId(id) })
}
const title = req.body.title

Category.findOne({
  $or: $or
})
.then(category => {
      category.title = title

      category
        .save()
        .then(updatedCategory => {
          req.flash(
            'success-message',
            `The Category ${updatedCategory.title} has been deleted.`
          )
          res.redirect('/dashboard/categories')
        })
        .catch(err => {
          req.flash(
            'error-message',
            `There is a problem while updating this category.`
          )
        })
    })
  },

  deleteCategories: (req, res) => {
const id = req.params.id
const $or = [{ slug: id }]

if (ObjectId.isValid(id)) {
  $or.push({ _id: ObjectId(id) })
}



    Category.findOneAndDelete({$or: $or}).then(deletedCategory => {
      req.flash(
        'success-message',
        `The category ${deletedCategory.title} has been deleted.`
      )
      res.redirect('/dashboard/categories')
    })
  }
}
