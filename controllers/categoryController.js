const subcategoryModel = require('../models/subcategoryModel')

const Post = require('../models/postModel').Post
const Category = require('../models/categoryModel').Category
const ObjectId = require('mongoose').Types.ObjectId
const Comment = require('../models/commentModel').Comment
const SubCategory = require('../models/subcategoryModel').SubCategory
module.exports = {
  /* ALL CATEGORY METHODS*/
  getCategories: (req, res) => {
    Category.find()
      .populate('author')
      .then(cats => {
        res.render('admin/category/index', {
                  title: 'All Categories',

          categories: cats
        })
      })
  },

  createCategories: (req, res) => {
    const title = req.body.title
    const slug = req.body.slug
    const description = req.body.description
    const author = req.user._id

    const newCategory = new Category({
      author: author,
      title: title,
      slug: slug,
      description: description
    })

    newCategory.save().then(category => {
      res.redirect('/dashboard/categories')
    })
  },

  getEditCategoriesPage: async (req, res) => {
    const id = req.params.id
    const $or = [{
      slug: id
    }]

    if (ObjectId.isValid(id)) {
      $or.push({
        _id: ObjectId(id)
      })
    }

    const cats = await Category.find()

    Category.findOne({
      $or: $or
    }).then(cat => {
      res.render('admin/category/edit', {
                title: 'Edit Category',

        category: cat,
        categories: cats
      })
    })
  },

  submitEditCategoriesPage: (req, res) => {
    const id = req.params.id
    const $or = [{
      slug: id
    }]

    if (ObjectId.isValid(id)) {
      $or.push({
        _id: ObjectId(id)
      })
    }
    const title = req.body.title
    const slug = req.body.slug
    const description = req.body.description


    Category.findOne({
        $or: $or
      })
      .then(category => {
        category.title = title
        category.slug = slug
        category.description = description



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
    const $or = [{
      slug: id
    }]

    if (ObjectId.isValid(id)) {
      $or.push({
        _id: ObjectId(id)
      })
    }


    Category.findOneAndDelete({
      $or: $or
    }).then(deletedCategory => {
      req.flash(
        'success-message',
        `The category ${deletedCategory.title} has been deleted.`
      )
      res.redirect('/dashboard/categories')
    })
  },
  getSubCategoryPage: (req, res) => {

    Category.find().then(categories => {
      SubCategory.find().then(subcategories => {
        res.render('admin/subcategory/index', {
                  title: 'All SubCategories',

          categories: categories,
          subcategories: subcategories
        })
      })

    })
  },
  createSubCategory: (req, res) => {
    const title = req.body.title;
    const slug = req.body.slug;
    const category = req.body.category
    const description = req.body.description
    const author = req.user._id

    const newSubCategory = new SubCategory({
      author: author,
      title: title,
      slug: slug,
      category: category,
      description: description
    })

    newSubCategory.save().then(savedSubCategory => {
      res.redirect('/dashboard/subcategories')
    })
  },
  getEditSubCategoriesPage: async (req, res) => {
    const subcategories = await SubCategory.find()
    const categories = await Category.find()
    const id = req.params.id
    const $or = [{
      slug: id
    }]

    if (ObjectId.isValid(id)) {
      $or.push({
        _id: ObjectId(id)
      })
    }

    SubCategory.findOne({
      $or: $or
    }).then(subcategory => {
      res.render('admin/subcategory/edit', {
                title: 'Edit SubCategory',

        subcategory: subcategory,
        subcategories: subcategories,
        categories: categories
      })
    })
  },
  submitEditSubCategoriesPage: (req, res) => {
    const id = req.params.id
    const $or = [{
      slug: id
    }]

    if (ObjectId.isValid(id)) {
      $or.push({
        _id: ObjectId(id)
      })
    }

    SubCategory.findOneAndUpdate({
      $or: $or
    }).then(subcategory => {
      subcategory.title = req.body.title,
        subcategory.slug = req.body.subcategory,
        subcategory.description = req.body.description

      subcategory.save().then(updatedSubCategory => {
        res.redirect('/dashboard/category/subcategories')
      })
    })
  },
  deleteSubCategoy: (req, res) => {
    const id = req.params.id

    SubCategory.findByIdAndDelete(id).then(deletedPost => {
      res.redirect('/dashboard/subcategories')
    })
  }
}