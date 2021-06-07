import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { environment } from '../../environments/environment';

const { API_URL } = environment;
@Injectable()
export class QuestionsService {

  constructor(private http: HttpClient) {}

  getQuestions(): Observable<any> {
    return this.http.get(API_URL);
  }


}
