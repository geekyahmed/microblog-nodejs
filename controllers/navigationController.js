const Navigation = require('../models/navigationModel').Navigation
const ObjectId = require('mongoose').Types.ObjectId

module.exports = {
    getNavigations: async (req, res) => {
        const navigation = await Navigation.find()

        res.render('admin/navigation/index', {
            navigation: navigation
        })
    },
    addNavigation: (req, res) => {
        const title = req.body.title
        const slug = req.body.slug

        const newNavigation = new Navigation({
            title: title,
            slug: slug
        })

        newNavigation.save().then(nav => {
            req.flash('success_message', `Navigation Bar Created`)
            res.redirect('/dashboard/navigation')
        })
    },
    getEditNavigation: (req, res) => {
        const id = req.params.id
        const $or = [{
            slug: id
        }]
        if (ObjectId.isValid(id)) {
            $or.push({
                _id: ObjectId(id)
            })
        }
        Navigation.findOne({
            $or: $or
        }).then(navigation => {
            res.render('admin/navigation/edit', {navigation: navigation})
        })
    },
    editNavigation: (req, res) => {
        const id = req.params.id
        const $or = [{
            slug: id
        }]
        if (ObjectId.isValid(id)) {
            $or.push({
                _id: ObjectId(id)
            })
        }
        Navigation.findOne({
            $or: $or
        }).then(nav => {
            nav.title = req.body.title
            nav.slug = req.body.slug

            nav.save().then(navBar => {
                req.flash('success_message', `Updated Navigation Bar`)
                res.redirect('/dashboard/navigation')
            })
        })
    },
    deleteNavigation: (req, res) => {
        const id = req.params.id
        const $or = [{
            slug: id
        }]
        if (ObjectId.isValid(id)) {
            $or.push({
                _id: ObjectId(id)
            })
        }
        Navigation.findOneAndDelete({
            $or: $or
        }).then(deletedNav => {
            req.flash('success_message', `Deleted Navigation Bar`)
            res.redirect('/dashboard/navigation')
        })
    }
}