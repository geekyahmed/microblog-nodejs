const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FooterSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    links: [{
        facebook: {
            type: String
        },
        twitter: {
            type: String
        },
        linkedin: {
            type: String
        },
        instagram : {
            type: String
        }
    }],
    copyright: {
        type: String,
        required: true
    },
    creationDate: {
        type: Date,
        default: Date.now(),
    }
})

module.exports = {
    Footer: mongoose.model('footer', FooterSchema)
}