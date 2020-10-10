import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {catchError, tap, map} from 'rxjs/operators';
import {EnvService} from '../service/env.service';
import {Storage} from '@ionic/storage';
import {Router} from '@angular/router';

@Injectable({
    providedIn: 'root'
})

export class ApiService {

    constructor(private http: HttpClient, private storage: Storage, private env: EnvService, public router: Router) {

    }

    url = this.env.API_URL;
    options = this.env.options;
    locale;


    // ---------------- Properties---------------
    question: any[];
    seconds: number;
    timer;
    qnProgress: number;
    correctAnswerCount = 0;


    getquestions(endPoint, type,locale) {
        const url = this.url + endPoint + '/' + type;
        const options = this.options;
         locale = {
            lang: locale
        }
        return this.http.post(url, locale , options).pipe(
            tap(_ => {
            }),
            catchError(this.handleError(endPoint))
        );
    }


    getAllQuestions(endPoint) {
        const url = this.url + endPoint;
        const options = this.options;
        return this.http.get(url, options).pipe(
            tap(_ => {
            }),
            catchError(this.handleError(endPoint))
        );
    }


    test(endPoint) {
        const url = this.url + endPoint;
        const options = this.options;
        return this.http.get(url, options).pipe(
            tap(_ => {
            }),
            catchError(this.handleError(endPoint))
        );
    }


    answers(body) {
        return this.http.post(this.env.API_URL + 'storanswers', body, this.env.options).pipe(
            tap((data: any) => {
                this.storage.set('data', data)
                    .then(
                        () => {
                            if (data.status == 200) {
                                console.log('done');
                            } else {
                                console.log(data.message);
                            }
                        },
                    );
                return data;
            }),
        );
    }
    updateanswers(body) {
        return this.http.post(this.env.API_URL + 'updateanswers', body, this.env.options).pipe(
            tap((data: any) => {
                this.storage.set('data', data)
                    .then(
                        () => {
                            if (data.status == 200) {
                                console.log('done');
                            } else {
                                console.log(data.message);
                            }
                        },
                    );
                return data;
            }),
        );
    }

    checklicens(body) {
        return this.http.post(this.env.API_URL + 'getResultBylisence', body, this.options)
            .pipe(
                tap(_ => {
                }),
                catchError(this.handleError(this.env.API_URL + 'getResultBylisence'))
        );
    }
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(error);
            return of(result as T);
        };
    }

// =====================================


    // ---------------- Helper Methods---------------
    displayTimeElapsed() {
        return Math.floor(this.seconds / 3600) + ':' + Math.floor(this.seconds / 60) + ':' + Math.floor(this.seconds % 60);
    }

    getParticipantName() {
        let participant = JSON.parse(localStorage.getItem('participant'));
        // return participant.Name;
    }


    // ---------------- Http Methods---------------


    getQuestions() {
        return this.http.get(this.url + 'getAllQuestions');
    }

    // getAnswers() {
    //   var body = this.question.map(x => x.QnID);
    //   return this.http.post(this.url + 'api/getanswers', body);
    // }

    getAnswers() {
        return this.http.get(this.url + 'getanswers');
    }


    submitScore() {
        let body = JSON.parse(localStorage.getItem('participant'));
        body.Score = this.correctAnswerCount;
        body.TimeSpent = this.seconds;
        return this.http.post(this.url + '/api/UpdateOutput', body);
    }


    sendEmail(licence: number) {
        
    }
}
