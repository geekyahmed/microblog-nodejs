module.exports = {
  isUserAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      return res.redirect('/login')
    }
  },
  isUserAdmin: (req, res, next) => {
    if (req.isAuthenticated() && req.user.role == 'admin') {
      next();
    } else {
      next()
    }
  }
};