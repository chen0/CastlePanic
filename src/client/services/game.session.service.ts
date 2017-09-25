import { Inject, Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Game } from './game';

import { Observable } from 'rxjs';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class GameSessionService {
    public url = 'api/newGame'; 
    public handleErrorObservable: string;
    constructor(@Inject(Http) private http: Http) {}

    public getGameSessionID(name: string): Observable<Game> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({headers: headers}); 
        return this.http.post(this.url, JSON.stringify({name}), options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Error'));
    }
}
