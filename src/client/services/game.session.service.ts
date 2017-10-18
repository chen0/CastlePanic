import { Inject, Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Game } from './game';

import { Observable } from 'rxjs';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class GameSessionService {
    public newGameAPI = 'api/newGame'; 
    public checkIDAPI = 'api/checkUser'; 
    public checkGameCodeAPI = 'api/checkGameCode'; 
    public joinGameAPI = 'api/joinGame';
    public lobbyAPI = 'api/lobbyInfo'; 
    public startGameAPI = 'api/startGame'; 
    public checkSessionAPI = 'api/checkSession';
    public handleErrorObservable: string;
    public nickName: string;
    public sessionID: string; 
    constructor(@Inject(Http) private http: Http) {}

    public getGameSessionID(name: string): Observable<Game> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({headers: headers}); 
        return this.http.post(this.newGameAPI, JSON.stringify({name}), options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Error'));
    }

    public checkUserID(gameCode: string, name: string): Observable<any> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({headers: headers}); 
        return this.http.post(this.checkIDAPI, JSON.stringify({gameCode, name}), options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Error'));
    }

    public checkGameCode(gameCode: string): Observable<any> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({headers: headers}); 
        return this.http.post(this.checkGameCodeAPI, JSON.stringify({gameCode}), options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Error'));
    }

    public joinGame(gameCode: string, name: string): Observable<void> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({headers: headers}); 
        return this.http.post(this.joinGameAPI, JSON.stringify({name, gameCode}), options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Error'));
    }

    public lobbyInfo(gameCode: string, name: string): Observable<any> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({headers: headers}); 
        return this.http.post(this.lobbyAPI, JSON.stringify({gameCode, name}), options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Error'));
    }

    public startGame(gameCode: string, name: string): Observable<any> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({headers: headers}); 
        return this.http.post(this.startGameAPI, JSON.stringify({gameCode, name}), options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Error'));
    }

    public checkSession(gameCode: string): Observable<any> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({headers: headers}); 
        return this.http.post(this.checkSessionAPI, JSON.stringify({gameCode}), options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Error'));
    }
}
