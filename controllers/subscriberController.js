const Subscriber = require('../models/subscriberModel').Subscriber

module.exports = {
  getSubscribers: async (req, res) => {
    const subscribers = await Subscriber.find()

    res.render('admin/newsletter/subscribers/index', {
      subscribers: subscribers
    })
  },
  addSubscriber: (req, res) => {
    const email = req.body.email
    const firstName = req.body.firstName
    const lastName = req.body.lastName

    const newSubscriber = new Subscriber({
      firstName: firstName,
      lastName: lastName,
      email: email
    })

    newSubscriber.save().then(savedSubscriber => {
      req.flash('success_message', `New Subscriber Added`)
      res.redirect('/dashboard/newsletter/subscribers')
    })
  },
  getUpdatedSubscriberPage: async(req, res) => {
    const id = req.params.id;
    const subscribers = await Subscriber.find()
    Subscriber.findById(id).then(subscriber => {
      res.render('admin/newsletter/subscribers/edit', {
        subscriber: subscriber,
        subscribers: subscribers
      })
    })
  },
  updateSubscriber: (req, res) => {
    const id = req.params.id
    const email = req.body.email
    const firstName = req.body.firstName
    const lastName = req.body.lastName

    Subscriber.findById(id).then(subscriber => {
      subscriber.email = email
      subscriber.firstName = firstName
      subscriber.lastName = lastName

      subscriber.save().then(sub => {
        req.flash('success_message', `Subscriber Updated Added`)
        res.redirect('/dashboard/newsletter/subscribers')
      })
    })
  },
  deleteSubscriber: (req, res) => {
    const id = req.params.id

    Subscriber.findByIdAndDelete(id).then(deletedSubscriber => {
      req.flash('success_message', `Subscriber Has Been Deleted`)
      res.redirect('/dashboard/newsletter/subscribers')
    })
  }
}
