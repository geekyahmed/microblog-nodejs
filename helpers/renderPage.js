const fs = require('fs')
const autoViews = {}

module.exports = {
    renderPage: async (req, res, next) => {
        var path = req.path.toLowerCase();
        // check cache; if it's there, render the view
        if (autoViews[path]) return res.render(autoViews[path]);
        // if it's not in the cache, see if there's
        // a .handlebars file that matches
        if (fs.existsSync(__dirname + '/views' + '/index' + '/custom/' + path + '.handlebars')) {
            autoViews[path] = path.replace(/^\//, '');
            return res.render(autoViews[path]);
        }
        // no view found; pass on to 404 handler
        next();
    }
}