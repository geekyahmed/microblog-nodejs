const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')
const Schema = mongoose.Schema

mongoose.plugin(slug)

const PostSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    slug: 'title'
  },
  status: {
    type: String,
    default: 'public'
  },
    type: {
    type: String,
    default: 'post'
  },
  description: {
    type: String,
    required: true
  },

  creationDate: {
    type: Date,
    default: Date.now()
  },

  author: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  isFeatured: {
    type: Boolean,
    default: true
  },
  isTop: {
    type: Boolean,
    default: true
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'category'
  },

  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'comment'
    }
  ],

  allowComments: {
    type: Boolean,
    default: false
  },

  file: {
    type: String,
    default: ''
  }
})

PostSchema.pre('save', function (next) {
  this.slug = this.title.split(' ').join('-')
  next()
})

module.exports = { Post: mongoose.model('post', PostSchema) }
