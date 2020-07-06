const express = require('express')
const router = express.Router()
const postController = require('../controllers/postController')
const profileController = require('../controllers/profileController')
const commentController = require('../controllers/commentController')
const categoryController = require('../controllers/categoryController')
const authorController = require('../controllers/authorController')
const blogController = require('../controllers/settingController')
const pageController = require('../controllers/pageController')
const subscriberController = require('../controllers/subscriberController')
const newsletterController = require('../controllers/newsletterController')
const dashboardController = require('../controllers/dashboardController')
const navigationController = require('../controllers/navigationController')
const footerController = require('../controllers/footerController')
const {
  isUserAuthenticated,
  isUserAdmin
} = require('../middlewares/auth.js')
router.all('/*', isUserAuthenticated, (req, res, next) => {
  req.app.locals.layout = 'admin'

  next()
})

/* DEFAULT ADMIN INDEX ROUTE*/

router.route('/').get(dashboardController.getUserDashboard)

router.route('/posts').get(postController.getPosts, postController.getAudios)

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
  .route('/audios/create')
  .get(postController.getCreateAudio)
  .post(postController.submitAudio)

router
  .route('/audios/edit/:id')
  .get(postController.getEditAudioPage)
  .put(postController.submitEditAudioPage)

router.route('/audios/delete/:id').delete(postController.deleteAudio)

router
  .route('/settings')
  .get(blogController.getBlogSettings)
  .put(blogController.submitBlogSetting)

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

router
  .route('/newsletter/compose')
  .get(newsletterController.getComposeNewsletterPage)
  .post(newsletterController.composeNewsletter)

router
  .route('/newsletter/subscribers')
  .get(subscriberController.getSubscribers)
  .post(subscriberController.addSubscriber)

router
  .route('/newsletter/subscriber/delete/:id')
  .delete(subscriberController.deleteSubscriber)

router.route('/authors').get(authorController.getAuthorsPage)

router
  .route('/author/add')
  .get(authorController.getAddAuthorPage)
  .post(authorController.addAuthour)

router
  .route('/author/edit/:id')
  .get(authorController.getEditAuthorPage)
  .put(authorController.editAuthor)

router.route('/author/delete/:id').delete(authorController.deleteAuthor)
router
  .route('/profile')
  .get(profileController.getProfile)
  .put(profileController.updateProfile)

router.route('/navigation').get(navigationController.getNavigations).post(navigationController.addNavigation)

router.route('/navigation/edit/:id').get(navigationController.getEditNavigation).put(navigationController.editNavigation)

router.route('/navigation/delete/:id').delete(navigationController.deleteNavigation)

router.route('/pages').get(pageController.getPages)

router.route('/page/create').get(pageController.getCreatePage).post(pageController.createPage)

router.route('/footer').get(footerController.getEditFooter)

router.route('/subcategories').get(categoryController.getSubCategoryPage).post(categoryController.createSubCategory)

router.route('/subcategory/edit/:id').get(categoryController.getEditSubCategoriesPage).put(categoryController.submitEditSubCategoriesPage)

router.route('/subcategory/delete/:id').delete(categoryController.deleteSubCategoy)

module.exports = router