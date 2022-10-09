import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubFormComponent } from './components/sub-form/sub-form.component';
import { FormsModule } from '@angular/forms';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';



@NgModule({
  declarations: [
    SubFormComponent,
    SafeHtmlPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    SubFormComponent,
    SafeHtmlPipe
  ]
})
export class SharedModule { }
