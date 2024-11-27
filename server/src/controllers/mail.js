const nodemailer = require('nodemailer');
const config = require('../config');
require('dotenv').config();
class Mail{
    transporter = null;
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'Gmail',
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.GOOGLE_APP_PASSWORD,
            },
        });
    }
    async send(to, subject, text){
        try{
            const mailOptions = { from: config.mail, to, subject, text };
            await this.transporter.sendMail(mailOptions);
        }catch(e){
            console.log('Sending mail error: ', e);
        }
    }
}

module.exports = Mail;