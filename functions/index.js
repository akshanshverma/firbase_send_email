'use strict';

const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
// Configure the email transport using the default SMTP transport and a GMail account.

// For other types of transports such as Sendgrid see https://nodemailer.com/transports/

// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.

// const gmailEmail = functions.config().gmail.email;
// const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'notesfundoo@gmail.com',
        pass: 'spqkgtqvbytggfdq',
    },
});

// Sends an email confirmation when a user changes his mailing list subscription.
exports.sendEmail = functions.database.ref("/form_data").onWrite(async (change) => {
    const snapshot = change.after._data;
    // console.log('snap',snapshot);
    
    var val = snapshot[Object.keys(snapshot)[Object.keys(snapshot).length - 1]];
    // console.log('val',val );
    
    const mailOptions = {
        from: "notesfundoo@gmail.com",
        to: val.email,
    };

    mailOptions.subject = "New Contact Email From " + val.email;
    mailOptions.text = "New Email From " + val.email + "\nSubject :" + val.asubject + "\nMessage :" + val.message
    try {
        await mailTransport.sendMail(mailOptions);
        console.log('New email sent to: ', val.email);
    } catch (error) {
        console.error('There was an error while sending the email:', error);
    }
    return null;
});