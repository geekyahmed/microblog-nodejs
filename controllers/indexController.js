const ObjectId = require('mongoose').Types.ObjectId
const Post = require('../models/postModel').Post
const Category = require('../models/categoryModel').Category
const Setting = require('../models/settingModel').Setting
const Subscriber = require('../models/subscriberModel').Subscriber
const Navigation = require('../models/navigationModel').Navigation
const Comment = require('../models/commentModel').Comment
const User = require('../models/userModel').User

module.exports = {
  index: async (req, res) => {
    const setting = await Setting.findOne({
      title: 'Sparkpress Blog'
    })

    // destructure page and limit and set default values
    const {
      page = 1, limit = 5, featuredLimit = 5, topLimit = 3, categoryLimit = 5, commentLimit = 3, authorLimit = 3, audioLimit = 5
    } = req.query


    try {
      const navigation = await Navigation.find()

      const authors = await User.find()
        .limit(authorLimit * 1)
        .skip((page - 1) * authorLimit)

      const categories = await Category.find()
        .limit(categoryLimit * 1)
        .skip((page - 1) * categoryLimit)
        .exec()

      const comments = await Comment.find()
        .limit(commentLimit * 1)
        .exec()

      const featuredPosts = await Post.find({
          isFeatured: true,
          status: 'public'
        })
        .sort({
          title: -1
        })
        .populate('category')
        .populate('author')
        .limit(featuredLimit * 1)
        .skip((page - 1) * featuredLimit)
        .exec()

      const topPosts = await Post.find({
          isTop: true,
          status: 'public'
        })
        .sort({
          title: -1
        })
        .populate('category')
        .populate('author')
        .limit(topLimit * 1)
        .skip((page - 1) * topLimit)
        .exec()

      const audioPosts = await Post.find({
          type: 'audio'
        })
        .sort({
          title: -1
        })
        .populate('category')
        .populate('author')
        .limit(audioLimit * 1)
        .skip((page - 1) * audioLimit)
        .exec()

      // execute query with page and limit values
      const posts = await Post.find({
          status: 'public'
        })
        .sort({
          title: -1
        })
        .populate('category')
        .populate('author')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec()

      // get total documents in the Posts collection
      const count = await Post.countDocuments()

      // return response with posts, total pages, and current page
      res.render('index/index', {
        navigation: navigation,
        title: setting.title,
        file: setting.file,
        audioPosts: audioPosts,
        authors: authors,
        topPosts: topPosts,
        featuredPosts: featuredPosts,
        posts: posts,
        comments: comments,
        categories: categories,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      })
    } catch (err) {
      console.error(err.message)
    }
  },
  getSinglePost: async (req, res) => {
    const id = req.params.id
    const $or = [{
      slug: id
    }]

    if (ObjectId.isValid(id)) {
      $or.push({
        _id: ObjectId(id)
      })
    }
    const posts = await Post.find()
    const categories = await Category.find()
    Post.findOne({
        $or: $or
      })
      .populate('comments')
      .populate('author')
      .then(post => {
        if (!post) {
          res.status(404).render('index/404')
        } else {
          res.render('index/singlepost', {
            post: post,
            author: post.author,
            title: post.title,
            comments: post.comments,
            posts: posts,
            categories: categories
          })
        }
      })
  },
  getSingleAuthor: async (req, res) => {
    const id = req.params.id
    const $or = [{
      username: id
    }]

    if (ObjectId.isValid(id)) {
      $or.push({
        _id: ObjectId(id)
      })
    }
    const author = await User.find()
    const posts = await Post.find()
    User.findOne({
      $or: $or
    }).then(author => {
      if (!author) {
        res.status(404).render('index/404')
      } else {
        res.render('index/singleauthor', {
          author: author,
          post: author.post,
          posts: posts
        })
      }
    })
  },
  addSubscriber: (req, res) => {
    const email = req.body.email
    const firstName = req.body.firstName
    const lastName = req.body.lastName

    const newSubscriber = new Subscriber({
      firstName: firstName,
      lastName: lastName,
      email: email
    })

    newSubscriber.save().then(savedSubscriber => {
      req.flash('success_message', `You have just Subscribed `)
      res.redirect('/')
    })
  },
}