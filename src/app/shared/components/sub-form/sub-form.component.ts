import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'tlgyo-sub-form',
  templateUrl: './sub-form.component.html',
  styleUrls: ['./sub-form.component.scss']
})
export class SubFormComponent implements OnInit {
  @Input() title?: string;
  @Input() helpMsg?: string;
  alertConfig = {
    type: 'success',
    msg: '',
    show: false,
    timeout: 5
  }
  subscriberModel: any = {};
  constructor(private dataService: DataService) { }

  addSubscriber(data: any, form?: NgForm) {
    // console.log("Subscriber Form: ", form)
    if (!this.validateEmail(data.email)) return;
    const subscriber = {
      timestamp: new Date(),
      name: this.escapeRegExp(data.name),
      email: data.email,
    }
    this.alertConfig.type = 'success';
    this.alertConfig.msg = 'Oh Yeah! You\'re officially signed up to updates!';
    this.alertConfig.show = true;
    this.dataService.addToCollection('subscribers', subscriber)
    this.subscriberModel = {};
    form.resetForm();
  }

  private validateEmail(email: string) {
    return email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
  }

  private escapeRegExp(input: any) {
    const source = typeof input === 'string' || input instanceof String ? input : '';
    return source.replace(/[-[/\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }

  ngOnInit(): void {
  }

}
