const User = require('../models/userModel').User
const ObjectId = require('mongoose').Types.ObjectId
const Post = require('../models/postModel').Post
const Comment = require('../models/commentModel').Comment
const Category = require('../models/categoryModel').Category

module.exports = {
  getUserDashboard: async (req, res) => {
    if (req.user.role == 'admin') {
      try {
        const categories = await Category.find()
        const users = await User.find()
        // destructure page and limit and set default values
        const { page = 1, limit = 4 } = req.query
        const comments = await Comment.find()
          .limit(limit * 1)
          .exec()

        // execute query with page and limit values
        const posts = await Post.find()

        const draftposts = await Post.find({ status: 'draft' })

        const count = await Post.countDocuments()

        res.render('admin/index', {
        title: 'Dashboard',
          draftposts: draftposts,
          posts: posts,
          users: users,
          comments: comments,
          categories: categories,
          totalPages: Math.ceil(count / limit),
          currentPage: page
        })
      } catch (err) {
        console.error(err.message)
      }
    } else {
      try {
        const categories = await Category.find()

        const userPosts = await User.aggregate([
          {
            $match: {
              _id: ObjectId(req.user.id)
            }
          }
        ])
        // destructure page and limit and set default values
        const { page = 1, limit = 4 } = req.query
        const draftposts = await Post.find({ status: 'draft' })
        const comments = await Comment.find({ author: req.user.id })
          .limit(limit * 1)
          .exec()

        // execute query with page and limit values
        const posts = await Post.find({ author: req.user.id })
          .populate('category')
          .limit(limit * 1)
          .skip((page - 1) * limit)
          .exec()

        // get total documents in the Posts collection
        const count = await Post.countDocuments()

        // return response with posts, total pages, and current page
        res.render('admin/index', {
          // title: setting.title,
          draftposts: draftposts,
          posts: posts,
          comments: comments,
          categories: categories,
          totalPages: Math.ceil(count / limit),
          currentPage: page
        })
      } catch (err) {
        console.error(err.message)
      }
    }
  }
}
