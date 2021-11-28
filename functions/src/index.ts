import { initializeApp } from './modules/init.module';
import { respondToContact } from './functions/contact.function';
import { respondToSubscriber } from './functions/subscriber.function';

// Init Firebase then return admin auth credentials
initializeApp();

/**
 * method for sending welcome email to subscriber
 */
exports.sendSubscriberWelcome = respondToSubscriber()

/**
 * method for sending response to contact
 */
exports.sendNewContactEmail = respondToContact();
