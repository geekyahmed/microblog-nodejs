const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AdSchema = new Schema({
    leftSidebarImg: {
        type: String,
        default: ''
    },
    leftSidebarLink: {
        type: String,
    },
    rightSidebarImg: {
        type: String,
        default: ''
    },
    rightSidebarLink: {
        type: String,
    },
    headerImg: {
        type: String,
        default: ''
    },
    headerLink: {
        type: String
    },
    footerImg: {
        type: String,
        default: ''
    },
    footerLink: {
        type: String
    }
})

module.exports = {
    Ad: mongoose.model('ad', AdSchema)
}