const nodemailer = require('nodemailer')
const pug = require('pug');
const path = require('path');
const moment = require('moment')
const {
  MAIL_FROM_ADDRESS,
  MAILER_HOST,
  MAILER_USER,
  MAILER_PASSWORD
} = require('../configs/env')

class Mailer {
  constructor (transporter) {
    this.transporter = transporter
  }

  sendMail({ to, subject, html, from = MAIL_FROM_ADDRESS }) {
    return this.transporter.sendMail({
      from,
      to,
      subject,
      html
    })
  }

  sendOtp(email, otp, expiredAt) {
    const htmlContent = pug.renderFile(path.join(__dirname, '../views', 'otp.pug'), {
      otp,
      expiredAt: moment(expiredAt).format('YYYY-MM-DD HH:mm'),
    });

    return this.transporter.sendMail({
      from: MAIL_FROM_ADDRESS,
      to: email,
      subject: "Otp",
      html: htmlContent
    })
  }
}

console.log(MAILER_PASSWORD)

const transporter = nodemailer.createTransport({
  host: MAILER_HOST,
  port: 465, // Replace with your SMTP port (e.g., 465 for SSL, 587 for TLS)
  secure: true, // true for 465, false for other ports
  auth: {
    user: MAILER_USER,
    pass: MAILER_PASSWORD,
  },
})

module.exports = new Mailer(transporter)
