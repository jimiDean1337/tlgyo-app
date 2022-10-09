import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { ModalDirective, BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { CarouselConfig } from 'ngx-bootstrap/carousel';
import * as Aos from 'aos';
import { ObjectUnsubscribedError, Observable } from 'rxjs';
import {filter} from 'rxjs/operators';
import { DataService } from './core/services/data.service';
import { NavigationStart, Router } from '@angular/router';
declare const Waypoint: any;
// import { AlertComponent, AlertModule } from 'ngx-bootstrap/alert';

@Component({
  selector: 'tlgyo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    { provide: CarouselConfig, useValue: {  interval: 10000, showIndicators: true,  pauseOnFocus: true} }
  ]
})
export class AppComponent implements OnInit {
  @ViewChild('autoNewsletterModal', { static: false }) autoNewsletterModal?: ModalDirective;
  @ViewChild('programModal', { static: false }) programModal?: ModalDirective;
  modalRef?: BsModalRef;
  showHero: boolean = true;
  showLoader: boolean = true;
  isNewsletterModalShown = false;
  heroSlides: any;
  contactInfo: any;
  title = 'TLGYO.ORG';
  alertConfig = {
    type: 'success',
    msg: '',
    show: false,
    timeout: 5
  }
  navStart: Observable<NavigationStart>;

  constructor(
    private modalService: BsModalService,
    private dataService: DataService,
    private router: Router,
  ) {
    this.navStart = router.events.pipe(
      filter(evt => evt instanceof NavigationStart)
    ) as Observable<NavigationStart>;
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

  openModal(template: TemplateRef<any>, modalOpts?: ModalOptions) {
    this.modalRef = this.modalService.show(template, modalOpts);
  }

  private get ContactInfo() {
    return this.dataService.getDBObject('contact');
  }

  private get HeroSlides() {
    return this.dataService.getDBList('hero-slides')
  }


  ngOnInit() {
    Aos.init({
      useClassNames: true,
      once: false,
      duration: 900
    })
    // TODO: Remove newsletter display comment before deploy
    setTimeout(() => {
      this.isNewsletterModalShown = true;
    }, 7500)

    setTimeout(() => {
      this.showLoader = false;
    }, 2500)

    this.navStart.subscribe(evt => {
      if (evt.url.includes('baked-sale')) {
        this.showHero = false;
      } else {
        this.showHero = true;
      }
      // console.log('Nav Event: ', evt);
    })

      /**
  * Contact Database
  */
       this.ContactInfo.valueChanges().subscribe(contact => {
        this.contactInfo = contact;
        // console.log("GET ContactInfo", contact)
      })

       /**
   * Hero Slides Database
   */
    this.HeroSlides.valueChanges().subscribe(slides => {
      this.heroSlides = slides;
      // console.log("GET Slides", slides)
    })

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
        handler: (direction: any) => {
          let progress = select('.progress .progress-bar', true);
          progress.forEach((el) => {
            el.style.width = el.getAttribute('aria-valuenow') + '%';
          });
        }
      })
      return wp;
    }

  }
}
