const User = require('../models/userModel').User
const ObjectId = require('mongoose').Types.ObjectId
const Post = require('../models/postModel').Post
const Category = require('../models/categoryModel').Category
const { isEmpty } = require('../config/customFunctions')

module.exports = {
  getPosts: (req, res) => {
   if(req.user.role == 'admin'){
      Post.find()
      .populate('author')
      .populate('category')
      .then(posts => {
        res.render('admin/posts/index', {
          posts: posts
        })
      })
   }
   else{
      Post.find({'author' : req.user._id})
      .populate('author')
      .populate('category')
      .then(posts => {
        res.render('admin/posts/index', {
          posts: posts
        })
      })
   }
  },

  getCreatePost: async(req, res) => {
    const categories = await Category.find()
    res.render('admin/posts/create', {
      categories: categories    })
  },

  submitPost: (req, res) => {
    const commentsAllowed = !!req.body.allowComments
    const isFeaturedPost = !!req.body.isFeatured
    const isTopPost = !!req.body.isTop

    // Check for any input file
    let filename = ''

    if (!isEmpty(req.files)) {
      let file = req.files.uploadedFile
      filename = file.name
      let uploadDir = './public/uploads/posts/'
      file.mv(uploadDir + filename, err => {
        if (err) throw err
      })
    }

    const newPost = new Post({
      author: req.user._id,
      title: req.body.title,
      description: req.body.description,
      tag: req.body.tag,
      status: req.body.status,
      type: req.body.type,
      allowComments: commentsAllowed,
      isFeatured: isFeaturedPost,
      isTop: isTopPost,
      category: req.body.category,
      file: `/uploads/posts/${filename}`
    })

    newPost.save().then(post => {
      req.flash('success-message', 'Post created successfully.')
      res.redirect('/dashboard/posts')
    })
  },

  getEditPostPage: (req, res) => {
    const id = req.params.id
    const $or = [{ slug: id }]

    if (ObjectId.isValid(id)) {
      $or.push({ _id: ObjectId(id) })
    }
    Post.findOne({ $or: $or }).then(post => {
      Category.find().then(cats => {
        res.render('admin/posts/edit', { post: post, categories: cats })
      })
    })
  },

  submitEditPostPage: (req, res) => {
        const isFeaturedPost = !!req.body.isFeatured
    const isTopPost = !!req.body.isTop

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
    const commentsAllowed = !!req.body.allowComments
    const id = req.params.id
    const $or = [{ slug: id }]

    if (ObjectId.isValid(id)) {
      $or.push({ _id: ObjectId(id) })
    }

    Post.findOne({ $or: $or }).then(post => {
      post.title = req.body.title
      post.status = req.body.status
      post.type = req.body.type
      post.allowComments = commentsAllowed
      post.isFeatured = isFeaturedPost
      post.isTop = isTopPost
      post.description = req.body.description
      post.category = req.body.category,
            post.file = `/uploads/${filename}`


      post.save().then(updatePost => {
        req.flash(
          'success-message',
          `The Post ${updatePost.title} has been updated.`
        )
        res.redirect('/dashboard/posts')
      })
    })
  },

  deletePost: (req, res) => {
    const id = req.params.id
    Post.findByIdAndDelete(id).then(deletedPost => {
      req.flash(
        'success-message',
        `The post ${deletedPost.title} has been deleted.`
      )
      res.redirect('/dashboard/posts')
    })
  }
}
