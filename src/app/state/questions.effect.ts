import {Injectable} from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import {QuestionsService} from '../services/questions.service';


@Injectable()
export class QuestionEffects {
  constructor(
    private actions$: Actions,
    private questionsService: QuestionsService
  ) {}

  loadQuestions$ = createEffect(() => this.actions$.pipe(
    ofType('[Questioner Page] Load Questions'),
    mergeMap(() => this.questionsService.getQuestions()
      .pipe(
        map(response => {
          const action = { type: '[Questions API] Questions Loaded Success', payload: { Questions: response.results}}
          return action;
        } ),
        catchError(() => EMPTY)

      )
    )
  ));
}
