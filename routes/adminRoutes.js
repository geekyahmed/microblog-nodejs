const express = require('express')
const router = express.Router()
const postController = require('../controllers/postController')
const profileController = require('../controllers/profileController')
const commentController = require('../controllers/commentController')
const categoryController = require('../controllers/categoryController')
const blogController = require('../controllers/settingController')
const subscriberController = require('../controllers/subscriberController')
const newsletterController = require('../controllers/newsletterController')
const dashboardController = require('../controllers/dashboardController')
const { isUserAuthenticated, isUserAdmin } = require('../middlewares/auth.js')

router.all('/*', isUserAuthenticated, isUserAdmin, (req, res, next) => {
  req.app.locals.layout = 'admin'

  next()
})

/* DEFAULT ADMIN INDEX ROUTE*/

router.route('/').get(dashboardController.getUserDashboard)

router.route('/posts').get(postController.getPosts)

router
  .route('/posts/create')
  .get(postController.getCreatePost)
  .post(postController.submitPost)

router
  .route('/posts/edit/:id')
  .get(postController.getEditPostPage)
  .put(postController.submitEditPostPage)

router.route('/posts/delete/:id').delete(postController.deletePost)

router
  .route('/settings')
  .get(blogController.getBlogSettings)
  .post(blogController.submitBlogSetting)

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

router.route('/newsletter/compose')
.get(newsletterController.getComposeNewsletterPage)
.post(newsletterController.composeNewsletter)

router.route('/newsletter/subscribers')
.get(subscriberController.getSubscribers)
.post(subscriberController.addSubscriber)

router.route('/newsletter/subscriber/edit/:id')
.get(subscriberController.getUpdatedSubscriberPage)
.put(subscriberController.updateSubscriber)

router.route('/newsletter/subscriber/delete/:id').delete(subscriberController.deleteSubscriber)

router.route('/profile').get(profileController.getProfile).put(profileController.updateProfile)


module.exports = router
