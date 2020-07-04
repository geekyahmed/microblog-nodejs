const ObjectId = require('mongoose').Types.ObjectId
const Post = require('../models/postModel').Post
const Category = require('../models/categoryModel').Category
const Setting = require('../models/settingModel').Setting
const Subscriber = require('../models/subscriberModel').Subscriber
const Navigation = require('../models/navigationModel').Navigation
const Audio = require('../models/audioModel').Audio
const User = require('../models/userModel').User
const Ad = require('../models/adModel').Ad

module.exports = {
  index: async (req, res) => {
    const {
      page = 1, limit = 10, featuredLimit = 5, topLimit = 3, categoryLimit = 5, audioLimit = 5
    } = req.query

    const setting = await Setting.findOne()

    // destructure page and limit and set default values

    try {

      const categories = await Category.find()
        .limit(categoryLimit * 1)
        .skip((page - 1) * categoryLimit)
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

      const recommendedPosts = await Post.find({
          isRecommended: true
        })
        .sort({
          title: -1
        })
        .populate('category')
        .populate('author')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec()

      const audioPosts = await Audio.find({
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

      const ad = await Ad.findOne()
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
        title: setting.title,
        file: setting.file,
        recommendedPosts: recommendedPosts,
        audioPosts: audioPosts,
        topPosts: topPosts,
        ad: ad,
        featuredPosts: featuredPosts,
        posts: posts,
        categories: categories,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      })
    } catch (err) {
      console.error(err.message)
    }
  },
  getSinglePost: async (req, res) => {
    const {
      page = 1, limit = 10, featuredLimit = 5, topLimit = 3, categoryLimit = 5, audioLimit = 5
    } = req.query
    const navigation = await Navigation.find()

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
    const featuredPosts = await Post.find({
        isFeatured: true,
        status: 'public'
      })
      .sort({
        title: -1
      })
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
      .limit(topLimit * 1)
      .skip((page - 1) * topLimit)
      .exec()
    const categories = await Category.find()
      .limit(featuredLimit * 1)
      .skip((page - 1) * featuredLimit)

    Post.findOneAndUpdate({
        $inc: {
          views: 1
        }
      })
      .populate('category')
      .populate('comments')
      .populate('author')
      .then(post => {
        if (!post) {
          res.status(404).render('index/404')
        } else {
          res.render('index/singlepost', {
            navigation: navigation,
            post: post,
            featuredPosts: featuredPosts,
            topPosts: topPosts,
            author: post.author,
            title: post.title,
            comments: post.comments,
            posts: posts,
            categories: categories
          })
        }
      })
  },
  getSingleAudio: async (req, res) => {
    const {
      page = 1, limit = 10, featuredLimit = 5, topLimit = 3, categoryLimit = 5, audioLimit = 5
    } = req.query
    const navigation = await Navigation.find()

    const id = req.params.id
    const $or = [{
      slug: id
    }]

    if (ObjectId.isValid(id)) {
      $or.push({
        _id: ObjectId(id)
      })
    }
    const featuredPosts = await Post.find({
        isFeatured: true,
        status: 'public'
      })
      .sort({
        title: -1
      })
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
      .limit(topLimit * 1)
      .skip((page - 1) * topLimit)
      .exec()
    const categories = await Category.find()
      .limit(categoryLimit * 1)
      .skip((page - 1) * categoryLimit)
      .exec()
    const audios = await Audio.find()
    Audio.findOne({
        $or: $or
      })
      .populate('comments')
      .populate('author')
      .populate('category')
      .then(audio => {
        if (!audio) {
          res.status(404).render('index/404')
        } else {
          res.render('index/singleaudio', {
            navigation: navigation,

            audio: audio,
            author: audio.author,
            title: audio.title,
            comments: audio.comments,
            audios: audios,
            featuredPosts: featuredPosts,
            topPosts: topPosts,
            categories: categories
          })
        }
      })
  },
  getSingleAuthor: async (req, res) => {
    const {
      page = 1, limit = 10, featuredLimit = 5, topLimit = 3, categoryLimit = 5, audioLimit = 5
    } = req.query
    const navigation = await Navigation.find()

    const id = req.params.id
    const $or = [{
      username: id
    }]

    if (ObjectId.isValid(id)) {
      $or.push({
        _id: ObjectId(id)
      })
    }
    const posts = await Post.find()
    User.findOne({
      $or: $or
    }).then(author => {
      if (!author) {
        res.status(404).render('index/404')
      } else {
        res.render('index/singleauthor', {
          navigation: navigation,
          author: author,
          post: author.post,
          posts: posts
        })
      }
    })
  },
  getAllPosts: async (req, res) => {
    const {
      page = 1, limit = 10, featuredLimit = 5, topLimit = 3, categoryLimit = 5, audioLimit = 5
    } = req.query
    const posts = await Post.find({
        'status': 'public'
      })
      .populate('category')
      .populate('author')
      .sort({
        title: -1
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec()
    const featuredPosts = await Post.find({
        isFeatured: true,
        status: 'public'
      })
      .sort({
        title: -1
      })
      .limit(featuredLimit * 1)
      .skip((page - 1) * featuredLimit)
      .exec()

    const categories = await Category.find()
      .limit(categoryLimit * 1)
      .skip((page - 1) * categoryLimit)
      .exec()

    res.render('index/posts', {
      posts: posts,
      featuredPosts: featuredPosts,
      categories: categories
    })

  },
  addSubscriber: (req, res) => {
    const email = req.body.email

    const newSubscriber = new Subscriber({
      email: email
    })

    newSubscriber.save().then(savedSubscriber => {
      req.flash('success_message', `You have just Subscribed `)
      res.redirect('/')
    })
  }
}