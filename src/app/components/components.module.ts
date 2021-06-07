import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

import { SingleQuestionComponent } from './single-question/single-question.component';
import {ProgressBarModule} from 'primeng/progressbar';

@NgModule({
  declarations: [
     SingleQuestionComponent
  ],
  exports: [
     SingleQuestionComponent
  ],
  imports: [
    CommonModule,
    CardModule,
    ProgressBarModule,
  ]
})
export class ComponentsModule { }
