import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionerComponent } from './questioner/questioner.component';

import {CarouselModule} from 'primeng/carousel';
import {ComponentsModule} from '../../components/components.module';
import {PanelModule} from 'primeng/panel';
import {QuestionsService} from '../../services/questions.service';

@NgModule({
  declarations: [
    QuestionerComponent
  ],
  providers: [
    QuestionsService
  ],
  imports: [
    CommonModule,
    PanelModule,
    CarouselModule,
    ComponentsModule
  ]
})
export class QuestionerModule { }
