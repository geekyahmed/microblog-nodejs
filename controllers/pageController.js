const Page = require('../models/pageModel').Page
const ObjectId = require('mongoose').Types.ObjectId
const fs = require('fs')

module.exports = {
    getPages: async (req, res) => {
        const pages = await Page.find()
        res.render('admin/pages/create', {
                    title: 'All Pages',

            pages: pages
        })
    },
    getCreatePage: (req, res) => {
        res.render('admin/pages/create', {        title: 'Create Page',
})
    },
    createPage: (req, res, next) => {
        const title = req.body.title
        const slug = req.body.slug
        const content = req.body.content

        const newPage = new Page({
            title: title.toLowerCase(),
            slug: slug,
            content: content
        })

        newPage.save().then(savedPage => {
            const encoding = 'utf8'
            fs.writeFile(`${savedPage.title}.handlebars`, `${savedPage.content}`,encoding,
                function (err) {
                    if (err) throw err;
                });
            next()
            req.flash('success_message', `Page created successfully`)
        })
    }
}