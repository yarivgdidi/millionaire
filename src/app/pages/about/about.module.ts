import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './about/about.component';
import {AboutRoutingModule} from './about-routing.module';
import {PanelModule} from 'primeng/panel';
import {ButtonModule} from 'primeng/button';
@NgModule({
  declarations: [
    AboutComponent

  ],
  imports: [
    CommonModule,
    PanelModule,
    AboutRoutingModule,
    ButtonModule,
  ]
})
export class AboutModule { }
