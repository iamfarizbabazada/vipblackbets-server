const nodemailer = require('nodemailer')
const {MAIL_FROM_ADDRESS} = require('../configs/env')

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
    return this.transporter.sendMail({
      from: MAIL_FROM_ADDRESS,
      to: email,
      subject: "Skdir",
      text: otp
    })
  }
}

const transporter = nodemailer.createTransport()

module.exports = new Mailer(transporter)
