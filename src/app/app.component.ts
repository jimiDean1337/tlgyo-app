import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { NgForm } from '@angular/forms';
import * as Aos from 'aos';
import {CountUp, CountUpOptions} from 'countup.js';
import { ModalDirective } from 'ngx-bootstrap/modal';
declare const Waypoint: any;
// import { AlertComponent, AlertModule } from 'ngx-bootstrap/alert';

@Component({
  selector: 'tlgyo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('autoNewsletterModal', { static: false }) autoNewsletterModal?: ModalDirective;
  isNewsletterModalShown;

  title = 'tlgyo-app';
  alertConfig = {
    type: 'success',
    msg: '',
    show: false,
    timeout: 5
  }

  countsOptions: CountUpOptions = {
    duration: 10,
    startVal: 0,
  }

  subscriberModel: any = {};
  contactModel: any = {};
  constructor(private afs: AngularFirestore, analytics: AngularFireAnalytics) {
    analytics.logEvent('custom_event', );
  }

  showNewsletterModal(): void {
    this.isNewsletterModalShown = true;
  }

  hideNewsletterModal(): void {
    this.autoNewsletterModal?.hide();
  }

  onNewsletterModalHidden(): void {
    this.isNewsletterModalShown = false;
  }

  async addSubscriber(data: any, form?: NgForm) {
    const { name, email } = data;
    // console.log("Subscriber Form: ", form)
    const subscriber = {
      timestamp: new Date(),
      name: name.toUpperCase(),
      email
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

  countStarted(e: any) {
    console.log('Counting Started', e)
  }

  ngOnInit() {
    Aos.init({
      useClassNames: true
    })

    setTimeout(() => {
      this.isNewsletterModalShown = true;
    }, 5000)
    this.isNewsletterModalShown = false;
    /**
   * Easy selector helper function
   */
    const select = (el, all = false) => {
      el = el.trim()
      if (all) {
        return document.querySelectorAll(el)
      } else {
        return document.querySelector(el)
      }
    }

    /**
     * Easy event listener function
     */
    const on = (type: any, el: any, listener: any, all = false) => {
      let selectEl = select(el, all)
      if (selectEl) {
        if (all) {
          selectEl.forEach((e: any) => e.addEventListener(type, listener))
        } else {
          selectEl.addEventListener(type, listener)
        }
      }
    }

    /**
     * Easy on scroll event listener
     */
    const onscroll = (el, listener) => {
      el.addEventListener('scroll', listener)
    }

    /**
     * Navbar links active state on scroll
     */
    let navbarlinks = select('#navbar .scrollto', true)
    const navbarlinksActive = () => {
      let position = window.scrollY + 200
      navbarlinks.forEach(navbarlink => {
        if (!navbarlink.hash) return
        let section = select(navbarlink.hash)
        if (!section) return
        if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
          navbarlink.classList.add('active')
        } else {
          navbarlink.classList.remove('active')
        }
      })
    }
    window.addEventListener('load', navbarlinksActive)
    onscroll(document, navbarlinksActive)

    /**
     * Scrolls to an element with header offset
     */
    const scrollto = (el) => {
      let header = select('#header')
      let offset = header.offsetHeight

      let elementPos = select(el).offsetTop
      window.scrollTo({
        top: elementPos - offset,
        behavior: 'smooth'
      })
    }

    /**
     * Header fixed top on scroll
     */
    let selectHeader = select('#header')
    if (selectHeader) {
      let headerOffset = selectHeader.offsetTop
      let nextElement = selectHeader.nextElementSibling
      const headerFixed = () => {
        if ((headerOffset - window.scrollY) <= 0) {
          selectHeader.classList.add('fixed-top')
          nextElement.classList.add('scrolled-offset')
        } else {
          selectHeader.classList.remove('fixed-top')
          nextElement.classList.remove('scrolled-offset')
        }
      }
      window.addEventListener('load', headerFixed)
      onscroll(document, headerFixed)
    }

    /**
     * Hero carousel indicators
     */
    let heroCarouselIndicators = select("#hero-carousel-indicators")
    let heroCarouselItems = select('#heroCarousel .carousel-item', true)

    heroCarouselItems.forEach((item, index) => {
      (index === 0) ?
        heroCarouselIndicators.innerHTML += "<li data-bs-target='#heroCarousel' data-bs-slide-to='" + index + "' class='active'></li>" :
        heroCarouselIndicators.innerHTML += "<li data-bs-target='#heroCarousel' data-bs-slide-to='" + index + "'></li>"
    });

    /**
     * Back to top button
     */
    let backtotop = select('.back-to-top')
    if (backtotop) {
      const toggleBacktotop = () => {
        if (window.scrollY > 100) {
          backtotop.classList.add('active')
        } else {
          backtotop.classList.remove('active')
        }
      }
      window.addEventListener('load', toggleBacktotop)
      onscroll(document, toggleBacktotop)
    }

    /**
     * Mobile nav toggle
     */
    on('click', '.mobile-nav-toggle', function (e) {
      select('#navbar').classList.toggle('navbar-mobile')
      this.classList.toggle('bi-list')
      this.classList.toggle('bi-x')
    })

    /**
     * Mobile nav dropdowns activate
     */
    on('click', '.navbar .dropdown > a', function (e) {
      if (select('#navbar').classList.contains('navbar-mobile')) {
        e.preventDefault()
        this.nextElementSibling.classList.toggle('dropdown-active')
      }
    }, true)

    /**
     * Scrool with ofset on links with a class name .scrollto
     */
    on('click', '.scrollto', function (e) {
      if (select(this.hash)) {
        e.preventDefault()

        let navbar = select('#navbar')
        if (navbar.classList.contains('navbar-mobile')) {
          navbar.classList.remove('navbar-mobile')
          let navbarToggle = select('.mobile-nav-toggle')
          navbarToggle.classList.toggle('bi-list')
          navbarToggle.classList.toggle('bi-x')
        }
        scrollto(this.hash)
      }
    }, true)

    /**
     * Scroll with ofset on page load with hash links in the url
     */
    window.addEventListener('load', () => {
      if (window.location.hash) {
        if (select(window.location.hash)) {
          scrollto(window.location.hash)
        }
      }
    });

    /**
     * Skills animation
     */
    let skilsContent = select('.skills-content');
    if (skilsContent) {
      const wp = new Waypoint({
        element: skilsContent,
        offset: '80%',
        handler: function (direction) {
          let progress = select('.progress .progress-bar', true);
          progress.forEach((el) => {
            el.style.width = el.getAttribute('aria-valuenow') + '%'
          });
        }
      })
      return wp;
    }
  }
}
