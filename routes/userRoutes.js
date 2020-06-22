const express = require('express')
const router = express.Router()
const postController = require('../controllers/postController')
const commentController = require('../controllers/commentController')
const categoryController = require('../controllers/categoryController')
const blogController = require('../controllers/settingController')
const { isUserAuthenticated, isUserAdmin } = require('../middlewares/auth.js')

router.all('/*', isUserAuthenticated, isUserAdmin, (req, res, next) => {
  req.app.locals.layout = 'admin'

  next()
})

/* DEFAULT ADMIN INDEX ROUTE*/

router.route('/').get(postController.getPosts)

router
  .route('/posts/create')
  .get(postController.getCreatePost)
  .post(postController.submitPost)

router
  .route('/posts/edit/:id')
  .get(postController.getEditPostPage)
  .put(postController.submitEditPostPage)

router.route('/posts/delete/:id').delete(postController.deletePost)


// /* ADMIN CATEGORY ROUTES*/

router
  .route('/categories')
  .get(categoryController.getCategories)
  .delete(categoryController.deleteCategories)

router.route('/category/create').post(categoryController.createCategories)

router
  .route('/category/edit/:id')
  .get(categoryController.getEditCategoriesPage)
  .put(categoryController.submitEditCategoriesPage)

router.route('/category/delete/:id').delete(categoryController.deleteCategories)

/* ADMIN COMMENT ROUTES */
router.route('/comments').get(commentController.getComments)

router.route('/comment/delete/:id').delete(commentController.deleteComment)

module.exports = router
