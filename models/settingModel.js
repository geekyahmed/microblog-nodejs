const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SettingSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  tagline: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  file: {
    type: String,
    default: ''
  }
})
module.exports = { Setting: mongoose.model('setting', SettingSchema) }
