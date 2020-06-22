const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator')

mongoose.plugin(slug)

const CategorySchema = new Schema({

    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        slug: 'title'
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

CategorySchema.pre('save', function (next) {
  this.slug = this.title.split(' ').join('-')
  next()
})

module.exports = {Category: mongoose.model('category', CategorySchema )};