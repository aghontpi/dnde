import { message } from 'antd';
const sgMail = require('@sendgrid/mail');

const sendMail = (to: string, html: string) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: 'gopinath2nr@gmail.com', // Change to your recipient
    from: 'admin@bluepie.com', // Change to your verified sender
    subject: 'Test Design',
    text: 'check your design here',
    html: html,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent');
      message.loading('sending mail...', 3).then(() => message.success('mail sent!'));
    })
    .catch((error: any) => {
      message.error('error sending mail');
      console.error(error);
    });
};

export { sendMail };
