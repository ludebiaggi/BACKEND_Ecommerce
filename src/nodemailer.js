import nodemailer from 'nodemailer'
import config from './config.js'

export const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  auth: {
    user: config.gmail_user,
    pass: config.gmail_password,
  },
})

