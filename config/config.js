module.exports = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 80,
    serverDetails: {
        allowedHeaders: ['content-type', 'username', 'Pragma', 'timeout', 'Authorization'],
        exposedHeaders: ['content-type', 'username', 'Pragma', 'timeout', 'Authorization']
    },
    mailer: {
        to: [],
        from: [],
        cc: [],
        bcc: []        
    },
    smtpDetails: {
        host: process.env.SMTP_SERVER_HOSTNAME || 'smtp.gmail.com',
        port: process.env.SMTP_SERVER_PORT || 587,
        secure: false,
        auth: {
            user: '' || process.env.SMTP_EMAIL_ID,
            pass: '' || process.env.SMTP_EMAIL_PSWD
        }
    }, 
    weeks: 1
    
}