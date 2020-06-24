const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')
const Schema = mongoose.Schema

mongoose.plugin(slug)

const NavigationSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        slug: 'title'
    },

    creationDate: {
        type: Date,
        default: Date.now(),
    }
})
NavigationSchema.pre('save', function (next) {
    this.slug = this.title.split(' ').join('-')
    next()
})

module.exports = {
    Navigation: mongoose.model('navigation', NavigationSchema)
}