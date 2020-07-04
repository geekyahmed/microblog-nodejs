const Ad = require('../models/adModel').Ad

module.exports = {
    getAdsPage: async (res, res) => {
        Ad.findOne().then(ad => {
            res.render('admin/ad/index', {
                ad: ad
            })
        })
    },
    submitAdsPage: (req, res) => {

    }
}