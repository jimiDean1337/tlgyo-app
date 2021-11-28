import * as nodemailer from 'nodemailer';

export let Transporter: nodemailer.Transporter;

export function createMailTransport(config: any) {
  return Transporter = nodemailer.createTransport({
    name: config.name,
    service: config.service,
    auth: {
      user: config.email,
      pass: config.pass,
    },
  });
}

export async function sendEmail(options: nodemailer.SendMailOptions) {
  return await Transporter.sendMail(options);
}

export declare type MailOptions = nodemailer.SendMailOptions;
