"use strict";

/******************************************
 ****** Credentials Configuration ******
 ******************************************/
let credentials = {
    SENDINBLUE: {
        API_KEY: 'dummy',
        SENDER_EMAIL: process.env.SMTP_EMAIL
    },
    SMTP: {
        TRANSTPORT: {
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: 'tamit95091@gmail.com',
                pass: 'admin@1995'
            },
        },
        SENDER: 'tamit95091@gmail.com'
    },
    FCM: {
        API_KEY: 'AIzaSyCUeSXr7v6CXuu4vKlzliK_VHqA4ytyX7E'
    }
};

module.exports = credentials;