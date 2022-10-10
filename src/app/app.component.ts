import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import {
  ModalDirective,
  BsModalService,
  BsModalRef,
  ModalOptions,
} from 'ngx-bootstrap/modal';
import { CarouselConfig } from 'ngx-bootstrap/carousel';
import * as Aos from 'aos';
import { ObjectUnsubscribedError, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DataService } from './core/services/data.service';
import { NavigationStart, Router } from '@angular/router';
declare const Waypoint: any;
// import { AlertComponent, AlertModule } from 'ngx-bootstrap/alert';

@Component({
  selector: 'tlgyo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    {
      provide: CarouselConfig,
      useValue: { interval: 10000, showIndicators: true, pauseOnFocus: true },
    },
  ],
})
export class AppComponent implements OnInit {
  @ViewChild('autoNewsletterModal', { static: false })
  autoNewsletterModal?: ModalDirective;
  // @ViewChild('programModal', { static: false }) programModal?: ModalDirective;
  modalRef?: BsModalRef;
  showHero: boolean = true;
  showMobileNav = false;
  showLoader: boolean = true;
  isNewsletterModalShown = false;
  heroSlides: any;
  contactInfo: any;
  title = 'TLGYO.ORG';
  alertConfig = {
    type: 'success',
    msg: '',
    show: false,
    timeout: 5,
  };
  navStart: Observable<NavigationStart>;

  constructor(
    private modalService: BsModalService,
    private dataService: DataService,
    private router: Router
  ) {
    this.navStart = router.events.pipe(
      filter((evt) => evt instanceof NavigationStart)
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

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  toggleMobileNav() {
    this.showMobileNav = !this.showMobileNav;
  }

  private get ContactInfo() {
    return this.dataService.getDBObject('contact');
  }

  private get HeroSlides() {
    return this.dataService.getDBList('hero-slides');
  }

  ngOnInit() {
    Aos.init({
      useClassNames: true,
      once: false,
      duration: 900,
    });
    // TODO: Remove newsletter display comment before deploy
    setTimeout(() => {
      this.isNewsletterModalShown = false;
    }, 7500);


    this.navStart.subscribe((evt) => {
      this.showLoader = true;
      if (evt.url.includes('baked-sale')) {
        this.showHero = false;
      } else {
        this.showHero = true;
      }
      this.scrollToTop();
      this.showMobileNav = false;
      setTimeout(() => {
        this.showLoader = false;
      }, 2500);
      // console.log('Nav Event: ', evt);
    });

    /**
     * Contact Database
     */
    this.ContactInfo.valueChanges().subscribe((contact) => {
      this.contactInfo = contact;
      // console.log("GET ContactInfo", contact)
    });

    /**
     * Hero Slides Database
     */
    this.HeroSlides.valueChanges().subscribe((slides) => {
      this.heroSlides = slides;
      // console.log("GET Slides", slides)
    });

    /**
     * Easy selector helper function
     */
    const select = (el, all = false) => {
      el = el.trim();
      if (all) {
        return document.querySelectorAll(el);
      } else {
        return document.querySelector(el);
      }
    };

    /**
     * Easy event listener function
     */
    const on = (type: any, el: any, listener: any, all = false) => {
      let selectEl = select(el, all);
      if (selectEl) {
        if (all) {
          selectEl.forEach((e: any) => e.addEventListener(type, listener));
        } else {
          selectEl.addEventListener(type, listener);
        }
      }
    };

    /**
     * Easy on scroll event listener
     */
    const onscroll = (el, listener) => {
      el.addEventListener('scroll', listener);
    };

    /**
     * Scrolls to an element with header offset
     */
    const scrollto = (el) => {
      let header = select('#header');
      let offset = header.offsetHeight;

      let elementPos = select(el).offsetTop;
      window.scrollTo({
        top: elementPos - offset,
        behavior: 'smooth',
      });
    };

    /**
     * Mobile nav toggle
     */
    // on('click', '.mobile-nav-toggle', function (e) {
    //   select('#navbar').classList.toggle('navbar-mobile')
    //   this.classList.toggle('bi-list')
    //   this.classList.toggle('bi-x')
    // })

    /**
     * Header fixed top on scroll
     */
    let selectHeader = select('#header');
    if (selectHeader) {
      console.log('selectHeader app');
      let headerOffset = selectHeader.offsetTop;
      let nextElement = selectHeader.nextElementSibling;
      const headerFixed = () => {
        if (headerOffset - window.scrollY <= 0) {
          selectHeader.classList.add('fixed-top');
          nextElement.classList.add('scrolled-offset');
        } else {
          selectHeader.classList.remove('fixed-top');
          nextElement.classList.remove('scrolled-offset');
        }
      };
      window.addEventListener('load', headerFixed);
      onscroll(document, headerFixed);
    }

    /**
     * Scrool with ofset on links with a class name .scrollto
     */
    on(
      'click',
      '.scrollto',
      function (e) {
        console.log('scroll to links app');
        let navbar = select('#navbar');
        if (navbar.classList.contains('navbar-mobile')) {
          navbar.classList.remove('navbar-mobile');
          let navbarToggle = select('.mobile-nav-toggle');
          navbarToggle.classList.toggle('bi-list');
          navbarToggle.classList.toggle('bi-x');
        }
        if (select(this.hash)) {
          e.preventDefault();
          scrollto(this.hash);
        }
      },
      true
    );
  }
}
