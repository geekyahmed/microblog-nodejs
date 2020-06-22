const Newsletter = require('../models/newsletterModel').Newsletter
const Subscriber = require('../models/subscriberModel').Subscriber
const nodemailer = require('nodemailer')

module.exports = {
    getComposeNewsletterPage: async(req, res)=> {
      const subscribers = await Subscriber.find()
        .then(subscribers => {
          res.render('admin/newsletter/compose', {
            subscribers: subscribers
          })
        })
    },
    composeNewsletter: async(req, res)=> {
        const title = req.body.title;
        const body = req.body.body;
        const subscribers = await Subscriber.find();

        const newsletterDetails = new Newsletter({
            title: title,
            subscribers: subscribers,
            body: body
        })
        newsletterDetails.save().then(newsLetter => {
                  const transporter = nodemailer.createTransport({
                      service: 'gmail',
                      auth: {
                        user: process.env.GMAIL_USER,
                        pass: process.env.GMAIL_PASS
                      }
                    })
                    const mailOptions = {
                      from: 'SparkPress <newsletter@sparkpress.com>',
                      to: subscribers.email,
                      subject: newsLetter.title,
                      text: newsLetter.body
                                        }
                    transporter.sendMail(mailOptions, err => {
                      if (err) {
                        console.log(err)
                      } else {
                        req.flash(
                          'success-message',
                         ` Newsletter Sent `
                        )
                        res.redirect('/dashboard/newsletter')
                      }
                    })
        })
    }
}