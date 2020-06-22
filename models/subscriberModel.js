const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SubscriberSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    creationDate: {
        type: Date,
        default: Date.now()
        }
})

module.exports = { Subscriber: mongoose.model('subscriber', SubscriberSchema) }
