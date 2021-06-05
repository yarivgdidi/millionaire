import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionerComponent } from './questioner/questioner.component';

import {PanelModule} from 'primeng/panel';
import {CardModule} from 'primeng/card';

@NgModule({
  declarations: [
    QuestionerComponent
  ],
  imports: [
    CommonModule,
    PanelModule,
    CardModule,
  ]
})
export class QuestionerModule { }
