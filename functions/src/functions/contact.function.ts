import * as functions from 'firebase-functions';
import { sendEmail, MailOptions } from '../modules/mail.module';
// import { APP_NAME } from '../constants';
// import { TEMPLATE } from '../html-templates/contact.template';
// New Contact Response
export function respondToContact() {
  return functions.firestore
    .document(`contacts/{contactId}`)
    .onCreate((snap, context) => {
      const resource = context.resource;
      const contact: any = snap.data();
      if (snap.exists) {
        return sendWelcomeToContact(
          contact.email,
          contact.name,
          /* contact.subject,
          contact.message,
          contact.timestamp */
        ).then(res => console.log(res))
          .catch(err => console.log('error adding contact', err));
      } else {
        console.log(`failed to send contact email on ${resource}`, snap, context);
        return null;
      }
    });

}


// Sends a welcome email to the new contact.
async function sendWelcomeToContact(
  email?: string,
  name?: string,
  appName?: string
  /* subject?: string,
  message?: string,
  timestamp?: any */
) {
  const mailOptions: MailOptions = {
    from: `"TLGYO" noreply@tlgyo.org`,
    to: email,
    subject: `👋 Hey there, ${name || 'Friend'}!`,
    text: `Thank you for contacting TLGYO.ORG. \n\nWe are a small organization, but we will respond to your message as soon as possible. For updates please sign up at tlgyo.org.\n\n Thank you,`
  };

  await sendEmail(mailOptions);
  console.log('New contact email sent to:', email);
  return null;
}
