const User = require('../models/userModel').User
const ObjectId = require('mongoose').Types.ObjectId
const Audio = require('../models/audioModel').Audio
const Post = require('../models/postModel').Post
const Category = require('../models/categoryModel').Category
const SubCategory = require('../models/subcategoryModel').SubCategory
const {
  isEmpty
} = require('../config/customFunctions')

module.exports = {
  getPosts: (req, res) => {
    if (req.user.role == 'admin') {
      Post.find()
        .populate('author')
        .populate('category')
        .then(posts => {
          res.render('admin/posts/index', {
                    title: 'All Posts',
            posts: posts
          })
        })
    } else {
      Post.find({
          'author': req.user._id
        })
        .populate('author')
        .populate('category')
        .then(posts => {
          res.render('admin/posts/index', {
                    title: 'All Posts',

            posts: posts
          })
        })
    }
  },

  getCreatePost: async (req, res) => {
    const categories = await Category.find()
    const subcategories = await SubCategory.find()
    res.render('admin/posts/create', {
      categories: categories,
      subcategories: subcategories
    })
  },

  submitPost: (req, res) => {
    const commentsAllowed = !!req.body.allowComments
    const isFeaturedPost = !!req.body.isFeatured
    const isTopPost = !!req.body.isTop
    const isRecommendedPost = !!req.body.isRecommended

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
      excerpt: req.body.excerpt,
      tag: req.body.tag,
      status: req.body.status,
      type: req.body.type,
      allowComments: commentsAllowed,
      isRecommended: isRecommendedPost,
      isFeatured: isFeaturedPost,
      isTop: isTopPost,
      category: req.body.category,
      subcategory: req.body.subcategory,
      file: `/uploads/posts/${filename}`
    })

    newPost.save().then(post => {
      req.flash('success-message', 'Post created successfully.')
      res.redirect('/dashboard/posts')
    })
  },

  getEditPostPage: (req, res) => {
    const id = req.params.id
    const $or = [{
      slug: id
    }]

    if (ObjectId.isValid(id)) {
      $or.push({
        _id: ObjectId(id)
      })
    }
    Post.findOne({
      $or: $or
    }).then(post => {
      Category.find().then(cats => {
        res.render('admin/posts/edit', {
                  title: 'Edit Page',

          post: post,
          categories: cats
        })
      })
    })
  },

  submitEditPostPage: (req, res) => {
    const isFeaturedPost = !!req.body.isFeatured
    const isTopPost = !!req.body.isTop
    const isRecommendedPost = !!req.body.isRecommended
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
    const $or = [{
      slug: id
    }]

    if (ObjectId.isValid(id)) {
      $or.push({
        _id: ObjectId(id)
      })
    }

    Post.findOne({
      $or: $or
    }).then(post => {
      post.title = req.body.title
      post.status = req.body.status
      post.type = req.body.type
      post.allowComments = commentsAllowed
      post.isRecommended = isRecommendedPost
      post.isFeatured = isFeaturedPost
      post.isTop = isTopPost
      post.description = req.body.description
      post.excerpt = req.body.excerpt
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
  },
  getAudios: (req, res) => {
    if (req.user.role == 'admin') {
      Audio.find()
        .populate('author')
        .populate('category')
        .then(audios => {
          res.render('admin/posts/index', {
            audios: audios
          })
        })
    } else {
      Audio.find({
          'author': req.user._id
        })
        .populate('author')
        .populate('category')
        .then(audios => {
          res.render('admin/audios/index', {
            audios: audios
          })
        })
    }
  },

  getCreateAudio: async (req, res) => {
    const categories = await Category.find()
    res.render('admin/audios/create', {
      categories: categories
    })
  },

  submitAudio: (req, res) => {
    const commentsAllowed = !!req.body.allowComments

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

    // Check for any input file
    let audioname = ''

    if (!isEmpty(req.files)) {
      let audio = req.files.uploadedAudio
      audioname = audio.name
      let uploadDir = './public/uploads/audios/'
      audio.mv(uploadDir + audioname, err => {
        if (err) throw err
      })
    }

    const newAudio = new Audio({
      author: req.user._id,
      title: req.body.title,
      description: req.body.description,
      tag: req.body.tag,
      status: req.body.status,
      type: req.body.type,
      allowComments: commentsAllowed,
      category: req.body.category,
      file: `/uploads/posts/${filename}`,
      audio: `/uploads/audios/${audioname}`
    })

    newAudio.save().then(audio => {
      req.flash('success-message', 'Audio created successfully.')
      res.redirect('/dashboard/posts')
    })
  },

  getEditAudioPage: (req, res) => {
    const id = req.params.id
    const $or = [{
      slug: id
    }]

    if (ObjectId.isValid(id)) {
      $or.push({
        _id: ObjectId(id)
      })
    }
    Audio.findOne({
      $or: $or
    }).then(audio => {
      Category.find().then(cats => {
        res.render('admin/audios/edit', {
          audio: audio,
          categories: cats
        })
      })
    })
  },

  submitEditAudioPage: (req, res) => {
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

    let audioname = ''

    if (!isEmpty(req.files)) {
      let audio = req.files.uploadedAudio
      audioname = audio.name
      let uploadDir = './public/uploads/audios/'
      audio.mv(uploadDir + audioname, err => {
        if (err) throw err
      })
    }

    const commentsAllowed = !!req.body.allowComments
    const id = req.params.id
    const $or = [{
      slug: id
    }]

    if (ObjectId.isValid(id)) {
      $or.push({
        _id: ObjectId(id)
      })
    }

    Audio.findOne({
      $or: $or
    }).then(audio => {
      audio.title = req.body.title
      audio.status = req.body.status
      audio.type = req.body.type
      audio.allowComments = commentsAllowed
      audio.isFeatured = isFeaturedPost
      audio.isTop = isTopPost
      audio.description = req.body.description
      audio.category = req.body.category,
        audio.file = `/uploads/${filename}`


      audio.save().then(updatePost => {
        req.flash(
          'success-message',
          `The Audio ${updatePost.title} has been updated.`
        )
        res.redirect('/dashboard/posts')
      })
    })
  },

  deleteAudio: (req, res) => {
    const id = req.params.id
    Audio.findByIdAndDelete(id).then(deletedPost => {
      req.flash(
        'success-message',
        `The post ${deletedPost.title} has been deleted.`
      )
      res.redirect('/dashboard/posts')
    })
  }
}