import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubFormComponent } from './components/sub-form/sub-form.component';
import { FormsModule } from '@angular/forms';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { AlertComponent } from './components/alert/alert.component';
import { AlertModule } from 'ngx-bootstrap/alert';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {PopoverModule} from 'ngx-bootstrap/popover';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { ModalModule } from 'ngx-bootstrap/modal';
// import { AccordionModule } from 'ngx-bootstrap/accordion';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { CountUpModule } from 'ngx-countup';


@NgModule({
  declarations: [
    SubFormComponent,
    SafeHtmlPipe,
    AlertComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AlertModule,
    ModalModule,
    CollapseModule,
    CountUpModule,
    TooltipModule,
    PopoverModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    SubFormComponent,
    SafeHtmlPipe,
    AlertComponent
  ]
})
export class SharedModule { }
