const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator')

mongoose.plugin(slug)

const PageSchema = new Schema({

    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        slug: 'title'
    },
    content: {
        type: String
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

PageSchema.pre('save', function (next) {
    this.slug = this.title.split(' ').join('-')
    next()
})

module.exports = {
    Page: mongoose.model('page', PageSchema)
};