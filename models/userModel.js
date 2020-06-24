const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },

  lastName: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin']
  },
  file: {
    type: String,
    default: ''
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'post',
    }
  ],

  bio: {
    type: String
  },

  email: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true
  },
  creationDate: {
    type: Date,
    default: Date.now()
  }
})

module.exports = { User: mongoose.model('user', UserSchema) }
