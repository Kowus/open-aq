const nodemailer = require('nodemailer'),
    path = require('path'),
    env = require('./env'),
    moment = require('moment'),
    email = require('email-templates'),
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
