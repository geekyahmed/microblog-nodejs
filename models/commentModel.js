const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({

    body: {
        type: String,
        required: true
    },

    full_name: {
        type: String,
        required: true
    },

    email: {
        type: String
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'post'
    },

    date: {
        type: Date,
        default: Date.now()
    },

    commentIsApproved: {
        type: Boolean,
        default: true
    }


});

module.exports = { Comment: mongoose.model('comment', CommentSchema) };