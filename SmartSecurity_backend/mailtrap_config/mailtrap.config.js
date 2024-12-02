import {MailtrapClient} from 'mailtrap'
import dotenv from 'dotenv'

dotenv.config()

// const TOKEN = process.env.MAILTRAP_TOKEN;
// const ENDPOINT=process.env.MAILTRAP_ENDPOINT;

export const mailTrapClient = new MailtrapClient({
    endpoint:process.env.MAILTRAP_ENDPOINT,
  token: process.env.MAILTRAP_TOKEN
});

export const sender = {
  email: "hello@demomailtrap.com",
  name: "SmartSecurity",
};

// ======Default ========

// const recipients = [
//   {
//     email: "puchupaul61@gmail.com",
//   }
// ];

// client
//   .send({
//     from: sender,
//     to: recipients,
//     subject: "You are awesome!",
//     text: "Congrats for sending test email with Mailtrap!",
//     category: "Integration Test",
//   })
//   .then(console.log, console.error);