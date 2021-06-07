import { Component, OnInit } from '@angular/core';
import {Question} from '../../../model/question';
import {QuestionsService} from '../../../services/questions.service';
import {select, Store} from '@ngrx/store';
import { environment } from '../../../../environments/environment';
import {selectQuestions} from '../../../state/question.selector';

const NUMBER_OF_QUESTIONS = environment.NUMBER_OF_QUESTIONS;

@Component({
  selector: 'app-questioner',
  templateUrl: './questioner.component.html',
  styleUrls: ['./questioner.component.scss']
})
export class QuestionerComponent implements OnInit {
  questions: Question[] = [];
  currentPage = 0;
  questionStack: Question[] = [];
  constructor(private questionsService: QuestionsService,
              private store: Store
  ) {}

  ngOnInit(): void {
    for (let i = 0; i < NUMBER_OF_QUESTIONS; i++ ) {
      this.questions.push(
        {
          category: '',
          type: '',
          difficulty: '',
          question: '',
          correct_answer: '',
          incorrect_answers: ['', '', ''],
        }
      );
    }
    this.store.dispatch({type: '[Questioner Page] Load Questions'});
    // get one more for next cycle
    this.store.dispatch({type: '[Questioner Page] Load Questions'});
    // @ts-ignore
    this.store.pipe(select(selectQuestions)).subscribe(questions => {
      if (this.currentPage === 0 && this.questions[0].question === '' && questions.length > 0) {
        this.questions[0] = questions[0];
      }
      this.questionStack = [...questions];
    });
  }
  getQuestion(index: number): Question{
    return this.questions[index];
  }

  carouselOnPage(event: any): void {
    const { page } = event;
    this.currentPage = event.page;
    this.store.dispatch({type: '[Questioner Page] Load Questions'});
    if (this.questions[page].question === '') {
      // @ts-ignore
      this.questions[page] = this.questionStack.pop();
    }
  }
}
