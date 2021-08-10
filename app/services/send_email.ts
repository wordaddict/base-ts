import nodemailer from 'nodemailer';

import smtpTransport from 'nodemailer-smtp-transport';
import { config } from '../config'

const formatSubtitleFile = (array: string[]): string => {
    let finalString = ''
    for (const data of array) {
        finalString = finalString + data + "\n";
    }
    return finalString;
}

export const sendEmail = (data: string[], email: string) => {
    console.log('file sending...', data, email)
    const transport = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        auth: {
            user: config.email.mailAccountUser,
            pass: config.email.mailAccountPassword
        }
    }))

    const mail = {
        from: config.email.mailAccountUser,
        to: email,
        subject: "Lengoo subtitle translated file",
        text: `This is the translated subtitle file`,
        attachments: [{
            filename: 'subtitle.txt',
            content: formatSubtitleFile(data)
        }]
    }

    return transport.sendMail(mail, function (error, response) {
        if (error) {
            console.log('error send message', error);
        } else {
            console.log(`Message sent to ${email}`);
        }

        transport.close();
    });

}

