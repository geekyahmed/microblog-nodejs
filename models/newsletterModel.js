const mongoose = require('mongoose')
const Schema = mongoose.Schema

const NewsLetterSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    subscribers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'subscriber'
        }
    ],
    body: {
        type: String,
        required: true
    },
        creationDate: {
        type: Date,
        default: Date.now(),
        expires: 4200
    }
})

module.exports = {Newsletter : mongoose.model('newsletter', NewsLetterSchema)}