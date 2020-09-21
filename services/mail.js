const nodemailer = require('nodemailer')

// order notification email
module.exports = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_ACCOUNT,
    pass: process.env.GMAIL_PW
  }
})