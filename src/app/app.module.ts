import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TabMenuModule } from 'primeng/tabmenu';
import {QuestionerModule} from './pages/questioner/questioner.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {StoreModule} from '@ngrx/store';
import {questionsReducer} from './state/quastion.reducer';
import {HttpClientModule} from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    TabMenuModule,
    QuestionerModule,
    BrowserAnimationsModule,
    StoreModule.forRoot({ questions: questionsReducer }),

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
