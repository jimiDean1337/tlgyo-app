import * as functions from 'firebase-functions';
import { sendEmail, MailOptions } from '../modules/mail.module';
import { TEMPLATE } from '../html-templates/subscriber.template';
import { APP_NAME } from '../constants';
/**
 * method for sending welcome email to subscriber
 */
export function respondToSubscriber() {
  return functions.firestore
    .document(`subscribers/{subscriberId}`)
    .onCreate((snap, context) => {
      let user: any;
      if (snap.exists) {
        user = snap.data();
        return sendSubscriberWelcomeEmail(user.email)
          .catch(err => console.log('error subscribing user', err));
      } else {
        return null;
      }
    });
}


async function sendSubscriberWelcomeEmail(email: string) {
  const mailOptions: MailOptions = {
    from: `"TLGYO.ORG" noreply@tlgyo.org`,
    to: email,
    subject: `👋 Thanks for subscribing to ${APP_NAME} updates!`,
    html: TEMPLATE
  };

  // The user subscribed to updates and the newsletter, send welcome email to user.
  await sendEmail(mailOptions);
  return null;
}
