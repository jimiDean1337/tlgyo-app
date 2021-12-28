import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { ModalDirective, BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import {CountUp, CountUpOptions} from 'countup.js';
import { CarouselConfig } from 'ngx-bootstrap/carousel';
import * as Aos from 'aos';
import { Program } from './interfaces/program';
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

  showLoader: boolean = true;
  selectedProgram: Program = {};
  isNewsletterModalShown = false;

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
  programList: any;
  faqList: any;
  teamList: any;
  heroSlides: any;
  currentCounts: any;
  currentGoals: any;
  callToAction: any;
  stories: any;
  selectedStory: any;
  selectedFAQId: number = 0;
  contactInfo: any;

  constructor(
    private modalService: BsModalService,
    private db: AngularFireDatabase,
    private afs: AngularFirestore,
    private analytics: AngularFireAnalytics
  ) {
    analytics.logEvent('Splash', new Date());
  }

  triggerEvent(name: string, opts: any = null) {
    this.analytics.logEvent(name, {date: new Date(), opts})
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

  openProgramModal(template: TemplateRef<any>, selectedProgram: number = 0, modalOpts: ModalOptions = {class: 'modal-xl'}) {
    this.selectedProgram = this.programList[selectedProgram];
    this.modalRef = this.modalService.show(template, modalOpts);
  }

  openStoryModal(template: TemplateRef<any>, selectedStory: number = 0, modalOpts: ModalOptions = { class: 'modal-xl' }) {
    this.selectedStory = this.stories[selectedStory];
    this.modalRef = this.modalService.show(template, modalOpts);
  }

  openSelectedFAQ(id: number) {
    this.selectedFAQId = id;
  }

  addSubscriber(data: any, form?: NgForm) {
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
    this.afs.collection('subscribers').add(subscriber)
    this.subscriberModel = {};
    form.resetForm();
  }

  addContact(data: any, form?: NgForm) {
    const { name, email, subject, msg } = data;
    const contact = {
      timestamp: new Date(),
      name, email, subject, msg
    }
    this.alertConfig.type = 'success';
    this.alertConfig.msg = 'OK! Your message has been sent!';
    this.alertConfig.show = true;
    this.afs.collection('contacts').add(contact)
    this.contactModel = {};
    form.resetForm();
  }

  alertClosed() {
    this.alertConfig.show = false;
    this.alertConfig.msg = '';
  }

  private get Programs() {
    return this.db.list<Program>('programs')
  }

  private get FAQ() {
    return this.db.list<Program>('faq-list')
  }

  private get HeroSlides() {
    return this.db.list('hero-slides')
  }

  private get CurrentCounts() {
    return this.db.list('current-counts');
  }

  private get CurrentGoals() {
    return this.db.list('current-goals');
  }

  private get CallToAction() {
    return this.db.object('call-to-action');
  }

  private get Stories() {
    return this.db.list('stories');
  }

  private get Team() {
    return this.db.list('team');
  }

  private get ContactInfo() {
    return this.db.object('contact');
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

    /**
  * Contact Database
  */
    this.ContactInfo.valueChanges().subscribe(contact => {
      this.contactInfo = contact;
      console.log("GET ContactInfo", contact)
    })

    /**
   * Programs Database
   */
    this.Programs.valueChanges().subscribe(programs => {
      this.programList = programs;
      console.log("GET Programs", programs)
    })

    /**
  * FAQ Database
  */
    this.FAQ.valueChanges().subscribe(faq => {
      this.faqList = faq;
      console.log("GET FAQs", faq)
    })

    /**
  * Team Database
  */
    this.Team.valueChanges().subscribe(team => {
      this.teamList = team;
      console.log("GET Team", team)
    })

    /**
   * Hero Slides Database
   */
    this.HeroSlides.valueChanges().subscribe(slides => {
      this.heroSlides = slides;
      console.log("GET Slides", slides)
    })

    /**
   * Current Counts Database
   */
    this.CurrentCounts.valueChanges().subscribe(counts => {
      this.currentCounts = counts;
      console.log("GET Counts", counts)
    })

    /**
  * Current Goals Database
  */
    this.CurrentGoals.valueChanges().subscribe(goals => {
      this.currentGoals = goals;
      console.log("GET Goals", goals)
    })

    /**
 * Stories Database
 */
    this.Stories.valueChanges().subscribe(stories => {
      this.stories = stories;
      console.log("GET Stories", stories)
    })

    /**
  * CTA Database
  */
    this.CallToAction.valueChanges().subscribe(cta => {
      this.callToAction = cta;
      console.log("GET CTA", cta)
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
