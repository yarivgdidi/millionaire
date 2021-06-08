import { Component, OnInit } from '@angular/core';
import {QuestionsService} from '../../../services/questions.service';
import { environment } from '../../../../environments/environment';
import {selectQuestions} from '../../../state/question.selector';
import {select, Store} from '@ngrx/store';
import {QuestionDto} from '../../../model/QuestionDto';
import {QuestionObj} from '../../../model/QuestionObj';
import {AnswerObj} from '../../../model/AnswerObj';
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
  strikes = 0;
  success = 0;
  constructor(private questionsService: QuestionsService,
              private store: Store
  ) {}

  ngOnInit(): void {
    for (let i = 0; i < NUMBER_OF_QUESTIONS; i++ ) {
      this.questions.push(

        {
          index: i,
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

  getAnswer(answerObj: AnswerObj): void {
    const { answer , timer, skipped } = answerObj;
    this.questions[this.currentPage].answered = answer;
    this.questions[this.currentPage].timer = timer;
    this.questions[this.currentPage].skipped = skipped;
    if (answer?.isCorrect === false) {
      this.strikes += 1;
    } else if (answer?.isCorrect === true ) {
      this.success += 1;
    }
    if (this.strikes > 2) {
      alert('Oops');
    } else if (this.success === NUMBER_OF_QUESTIONS) {
      alert ('Wow');
    } else if (this.success + this.strikes === NUMBER_OF_QUESTIONS) {
      alert ('Almost');
    }
   }

  carouselOnPage(event: any): void {
    const { page } = event;
    // @ts-ignore
    // if (!this.questions[this.currentPage].answered && this.questions[this.currentPage]?.timer > 0 ){
    //   this.questions[this.currentPage].skipped = true;
    //
    // }
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
      index: this.currentPage,
      question,
      options: scrambled
    };
    return preparedQuestion as QuestionObj;
  }
}
