const config = require('./../../config');
const nodemailer = require('nodemailer');


/**
 * This method is used to notify the developers of feedback registered by the users and
 * the same is also stored in the datastore table.
 */
exports.mailerFunction = async(to, from, cc, bcc, subject, htmlBody, attachments) => {
    try {
        return new Promise((resolve, reject) => {
            var smtpTransport = nodemailer.createTransport(config.smtpDetails);              
            var mailConfig = {
                from: from,
                subject: subject,
                html: htmlBody,
                to: to,
                cc: cc,
                bcc: bcc
            };            
            if (attachments && attachments.length) {
                mailConfig.attachments = attachments
            }
            
            smtpTransport.sendMail(mailConfig, (err) => {
                if (err) {
                    console.log(err);
                    reject({
                        flag: 0,
                        data: {},
                        message: 'Error occurred while sending email.'
                    });
                } else {
                    resolve({
                        flag: 1,
                        data: {},
                        message: 'Email sent successfully.'
                    });
                }
            });
        });
    } catch (error) {
        console.log(error);
    }
};
