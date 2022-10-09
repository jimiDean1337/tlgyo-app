import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { ModalDirective, BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import {CountUp, CountUpOptions} from 'countup.js';
import { CarouselConfig } from 'ngx-bootstrap/carousel';
import { Program } from '../../interfaces/program';
import { ObjectUnsubscribedError } from 'rxjs';
import { DataService } from 'src/app/core/services/data.service';
declare const Waypoint: any;
// import { AlertComponent, AlertModule } from 'ngx-bootstrap/alert';

@Component({
  selector: 'tlgyo-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('programModal', { static: false }) programModal?: ModalDirective;
  modalRef?: BsModalRef;

  selectedProgram: Program = {};

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

  testimonialsCarouselConfig: any = {
    itemsPerSlide: 3,
    singleSlideOffset: true,
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
  events: any;
  testimonials: any;
  donators: any;

  constructor(
    private modalService: BsModalService,
    private db: AngularFireDatabase,
    private afs: AngularFirestore,
    private analytics: AngularFireAnalytics,
    private dataService: DataService,
  ) {
    analytics.logEvent('Splash', new Date());
  }

  triggerEvent(name: string, opts: any = null) {
    this.analytics.logEvent(name, {date: new Date(), opts})
  }

  openProgramModal(template: TemplateRef<any>, selectedProgram: number = 0, modalOpts: ModalOptions = {class: 'modal-xl'}) {
    this.selectedProgram = this.programList[selectedProgram];
    this.modalRef = this.modalService.show(template, modalOpts);
  }

  openStoryModal(template: TemplateRef<any>, selectedStory: number = 0, modalOpts: ModalOptions = { class: 'modal-xl' }) {
    this.selectedStory = this.stories[selectedStory];
    this.modalRef = this.modalService.show(template, modalOpts);
  }

  openModal(template: TemplateRef<any>, modalOpts?: ModalOptions) {
    this.modalRef = this.modalService.show(template, modalOpts);
  }

  openSelectedFAQ(id: number) {
    this.selectedFAQId = id;
  }

  addContact(data: any, form?: NgForm) {
    if (!this.validateEmail(data.email)) return;
    // TODO: Create Display messages for validation and sanitization errors
    const contact = {
      timestamp: new Date(),
      name: this.escapeRegExp(data.name),
      subject: this.escapeRegExp(data.subject),
      msg: this.escapeRegExp(data.msg),
      email: data.email,
    }
    // console.log('Contact form flow', contact)
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
    return this.dataService.getDBList<Program>('programs')
  }

  private get FAQ() {
    return this.dataService.getDBList<Program>('faq-list')
  }

  private get CurrentCounts() {
    return this.dataService.getDBList('current-counts');
  }

  private get CurrentGoals() {
    return this.dataService.getDBList('current-goals');
  }

  private get CallToAction() {
    return this.dataService.getDBObject('call-to-action');
  }

  private get Stories() {
    return this.dataService.getDBList('stories');
  }

  private get Events() {
    return this.dataService.getDBList('events');
  }

  private get Team() {
    return this.dataService.getDBList('team');
  }

  private get Testimonials() {
    return this.dataService.getDBList('testimonials');
  }

  private get Donators() {
    return this.dataService.getDBList('donators');
  }

  private validateEmail(email: string) {
    return email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
  }

  private escapeRegExp(input: any) {
    const source = typeof input === 'string' || input instanceof String ? input : '';
    return source.replace(/[-[/\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }

  ngOnInit() {

    /**
   * Programs Database
   */
    this.Programs.valueChanges().subscribe(programs => {
      this.programList = programs;
      // console.log("GET Programs", programs)
    })

    /**
  * FAQ Database
  */
    this.FAQ.valueChanges().subscribe(faq => {
      this.faqList = faq;
      // console.log("GET FAQs", faq)
    })

    /**
  * Team Database
  */
    this.Team.valueChanges().subscribe(team => {
      this.teamList = team;
      // console.log("GET Team", team)
    })

    /**
   * Current Counts Database
   */
    this.CurrentCounts.valueChanges().subscribe(counts => {
      this.currentCounts = counts;
      // console.log("GET Counts", counts)
    })

    /**
  * Current Goals Database
  */
    this.CurrentGoals.valueChanges().subscribe(goals => {
      this.currentGoals = goals;
      // console.log("GET Goals", goals)
    })

    /**
 * Stories Database
 */
    this.Stories.valueChanges().subscribe(stories => {
      this.stories = stories;
      // console.log("GET Stories", stories)
    })

      /**
 * Events Database
 */
       this.Events.valueChanges().subscribe(stories => {
        this.events = stories;
        // console.log("GET Stories", stories)
      })

    /**
  * CTA Database
  */
    this.CallToAction.valueChanges().subscribe(cta => {
      this.callToAction = cta;
      // console.log("GET CTA", cta)
    })

     /**
  * Testimonials Database
  */
      this.Testimonials.valueChanges().subscribe(testimonials => {
        this.testimonials = testimonials;
        // console.log("GET Testimonials", testimonials)
      })


     /**
  * Donators Database
  */
      this.Donators.valueChanges().subscribe(donators => {
        this.donators = donators;
        // console.log("GET Donators", donators)
      })
    }

}
