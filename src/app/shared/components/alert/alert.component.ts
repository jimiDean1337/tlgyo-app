import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'tlgyo-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  @Input() alertConfig?: any = {
    type: 'success',
    msg: '',
    show: false,
    timeout: 5,
  }
  @Input() show?: boolean;
  @Input() timeout?: number;
  @Input() type?: 'success'|'warning'|'danger'|'info';
  @Input() dismissible?: boolean;
  @Input() msg?: string;

  constructor() { }

  alertClosed() {
    this.alertConfig.show = false;
    this.alertConfig.msg = '';
  }

  ngOnInit(): void {
    if (!this.alertConfig) {
      this.alertConfig = {
        show: this.show,
        timeout: this.timeout,
        type: this.type,
        dismissible: this.dismissible,
        msg: this.msg,
      }
    }
  }

}
