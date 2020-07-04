const mongoose = require('mongoose')
const Schema = mongoose.Schema
const slug = require('mongoose-slug-generator')

mongoose.plugin(slug)

const SubCategorySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        slug: 'title'
    },
    description: {
        type: String
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'category'
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    creationDate: {
        type: Date,
        default: Date.now()
    }
})

SubCategorySchema.pre('save', function (next) {
    this.slug = this.title.split(' ').join('-')
    next()
})


module.exports = {
    SubCategory: mongoose.model('subcategory', SubCategorySchema)
}