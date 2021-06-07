import { Component, OnInit } from '@angular/core';
import {QuestionDto} from '../../../model/questionDto';
import {QuestionsService} from '../../../services/questions.service';
import {select, Store} from '@ngrx/store';
import { environment } from '../../../../environments/environment';
import {selectQuestions} from '../../../state/question.selector';
import {QuestionObj} from '../../../model/QuestionObj';
import { shuffle } from 'lodash';
const NUMBER_OF_QUESTIONS = environment.NUMBER_OF_QUESTIONS;

@Component({
  selector: 'app-questioner',
  templateUrl: './questioner.component.html',
  styleUrls: ['./questioner.component.scss']
})
export class QuestionerComponent implements OnInit {
  questions: QuestionObj[] = [];
  currentPage = 0;
  questionStack: QuestionDto[] = [];
  constructor(private questionsService: QuestionsService,
              private store: Store
  ) {}

  ngOnInit(): void {
    for (let i = 0; i < NUMBER_OF_QUESTIONS; i++ ) {
      this.questions.push(
        {
          question:  {
            category: '',
            type: '',
            difficulty: '',
            question: '',
            correct_answer: '',
            incorrect_answers: ['', '', ''],
        },
          options: []
        }
      );
    }
    this.store.dispatch({type: '[Questioner Page] Load Questions'});
    // get one more for next cycle
    this.store.dispatch({type: '[Questioner Page] Load Questions'});
    // @ts-ignore
    this.store.pipe(select(selectQuestions)).subscribe(questions => {
      if (this.currentPage === 0 && this.questions[0].question.question === '' && questions.length > 0) {
        this.questions[0] = this.prepareQuestionObj(questions[0]) ;
      }
      this.questionStack = [...questions];
    });
  }
  getQuestion(index: number): QuestionObj{
    return this.questions[index];
  }

  getAnswer(answer: any): void {
    console.log(this.currentPage, 'answer', answer);
  }

  carouselOnPage(event: any): void {
    const { page } = event;
    this.currentPage = event.page;
    this.store.dispatch({type: '[Questioner Page] Load Questions'});
    if (this.questions[page].question.question === '') {
      const question = this.questionStack.pop();
      this.questions[page] = this.prepareQuestionObj(question as QuestionDto);
    }
  }

  private prepareQuestionObj(question: QuestionDto): QuestionObj {
    const { incorrect_answers } = question;
    const options = incorrect_answers.map((answer, index) => ({answer, isCorrect: false, origIndex: index}));
    options.push({answer: question.correct_answer, isCorrect: true, origIndex: 3});
    const scrambled = shuffle(options);
    const preparedQuestion = {
      question,
      options: scrambled
    };
    return preparedQuestion as QuestionObj;
  }
}
