import { message } from 'antd';
import { logger } from './logger';
const sgMail = require('@sendgrid/mail');

const sendMail = (to: string, html: string) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to,
    from: 'admin@bluepie.com', // Change to your verified sender
    subject: 'Test Design',
    text: 'check your design with this mail',
    html: html,
  };
  sgMail
    .send(msg)
    .then(() => {
      logger.log('Email sent');
      message.loading('sending mail...', 2).then(() => message.success('mail sent!'));
    })
    .catch((error: any) => {
      message.error('error sending mail');
      logger.error(error);
    });
};

export { sendMail };
