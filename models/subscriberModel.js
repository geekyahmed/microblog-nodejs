const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SubscriberSchema = new Schema({
    email: {
        type: String,
        require: true
    },
    creationDate: {
        type: Date,
        default: Date.now()
        }
})

module.exports = { Subscriber: mongoose.model('subscriber', SubscriberSchema) }
