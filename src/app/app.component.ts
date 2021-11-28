import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NgForm } from '@angular/forms';
// import { AlertComponent, AlertModule } from 'ngx-bootstrap/alert';

@Component({
  selector: 'tlgyo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'tlgyo-app';
  alertConfig = {
    type: 'success',
    msg: '',
    show: false
  }

  subscriberModel: any = {};
  contactModel: any = {};
  constructor(private afs: AngularFirestore) { }

  async addSubscriber(data: any, form?: NgForm) {
    const { name, email } = data;
    console.log("Subscriber Form: ", form)
    const subscriber = {
      timestamp: new Date(),
      name, email
    }
    this.alertConfig.type = 'success';
    this.alertConfig.msg = 'Oh Yeah! You\'re officially signed up to updates!';
    this.alertConfig.show = true;
    await this.afs.collection('subscribers').add(subscriber)
    this.subscriberModel = {};
    form.resetForm();
  }

  async addContact(data: any, form?: NgForm) {
    const { name, email, subject, msg } = data;
    const contact = {
      timestamp: new Date(),
      name, email, subject, msg
    }
    this.alertConfig.type = 'success';
    this.alertConfig.msg = 'OK! Your message has been sent!';
    this.alertConfig.show = true;
    await this.afs.collection('contacts').add(contact)
    this.contactModel = {};
    form.resetForm();
  }

  alertClosed() {
    this.alertConfig.show = false;
    this.alertConfig.msg = '';
  }

  ngOnInit() {
    const select = (el: any, all = false) => {
      el = el.trim()
      if (all) {
        return document.querySelectorAll(el)
      } else {
        return document.querySelector(el)
      }
    }

    /**
   * Countdown timer
   */

    let countdown = select('.countdown');

    const countDownDate = function () {
      let timeleft = new Date(countdown.getAttribute('data-count')).getTime() - new Date().getTime();

      let weeks = Math.floor(timeleft / (1000 * 60 * 60 * 24 * 7));
      let days = Math.floor(timeleft / (1000 * 60 * 60 * 24) % 7);
      let hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((timeleft % (1000 * 60)) / 1000);

      let output = countdown.getAttribute('data-template');
      output = output.replace('%w', weeks).replace('%d', days).replace('%h', hours).replace('%m', minutes).replace('%s', seconds);
      countdown.innerHTML = output;
    }
    countDownDate();
    setInterval(countDownDate, 1000);
  }
}
