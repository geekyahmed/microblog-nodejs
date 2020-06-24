const express = require("express");
const router = express.Router();
const indexController = require("../controllers/indexController");
const commentController = require("../controllers/commentController");

router.route('/')
    .get(indexController.index)

router.route('/add')
    .post(indexController.addSubscriber)

router.route('/post/:id')
    .get(indexController.getSinglePost)
    .post(commentController.submitComment);

    router.route('/author/:id')
        .get(indexController.getSingleAuthor)




module.exports = router;
