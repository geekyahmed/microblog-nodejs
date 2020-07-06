const Post = require('../models/postModel').Post
const Audio = require('../models/audioModel').Audio
const Comment = require('../models/commentModel').Comment
const ObjectId = require('mongoose').Types.ObjectId

module.exports = {
  submitComment: (req, res) => {
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
      const newComment = new Comment({
        full_name: req.body.full_name,
        email: req.body.email,
        body: req.body.comment_body
      })

      post.comments.push(newComment)
      post.save().then(savedPost => {
        newComment.save().then(savedComment => {
          req.flash('success-message', 'Your comment was submitted .')
        })
      })
    })
  },
  submitAudioComment: (req, res) => {
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
      const newComment = new Comment({
        full_name: req.body.full_name,
        email: req.body.email,
        body: req.body.comment_body
      })

      audio.comments.push(newComment)
      audio.save().then(savedPost => {
        newComment.save().then(savedComment => {
          req.flash('success-message', 'Your comment was submitted .')
        })
      })
    })
  },
  getComments: (req, res) => {
    Comment.find()
      .populate('user')
      .then(comments => {
        res.render('admin/comments/index', {
          title: 'All Comments',

          comments: comments
        })
      })


  },
  deleteComment: (req, res) => {
    const id = req.params.id

    Comment.findByIdAndDelete(id).then(deletedComment => {
      req.flash('success_message', `Comment Deleted Successfully`)
      res.redirect('/dashboard/comments')
    })
  }
}