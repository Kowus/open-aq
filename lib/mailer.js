const nodemailer = require('nodemailer'),
    path = require('path'),
    env = require('./env'),
    moment = require('moment'),
    Email = require('email-templates'),
    transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: env.node_mailer.email,
            pass: env.node_mailer.password
        }
    }),
    email = new Email({
        message: {
            from: `Open AQ <${env.node_mailer.email}>`
        },
        // send:true,
        transport: transporter, views: {
            options: {
                extension: 'handlebars'
            }
        }
    });
;

module.exports = {
    confirm_email: (user, token) => {
        email.send({
            template: 'confirm_account',
            locals: {
                user: user,
                token: token
            },
            message: {
                to: `${user.username} <${user.email}>`,
                replyTo: env.node_mailer.replyTo
            }
        })
    }
};