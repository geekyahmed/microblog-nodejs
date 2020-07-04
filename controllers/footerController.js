const Footer = require('../models/footerModel').Footer

module.exports = {
    getFooter: async (req, res) => {
        Footer.findOne().then(footer => {
            res.render('partials/index/footer', {
                footer: footer
            })
        })
    },
    getEditFooter: (req, res) => {
        Footer.findOne()
            .then(footer => {
                res.render('admin/footer/index', {
                    footer: footer
                })
            })
    }
}