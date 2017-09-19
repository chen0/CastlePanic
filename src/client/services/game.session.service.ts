import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Game } from './game';

@Injectable()
export class GameSessionService {
	url = "api/newGame"; 
	//extractData: String;
	handleErrorObservable: String;
	constructor(@Inject(Http) private http:Http) {}

	public getGameSessionID(): Observable<Game> {
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({headers: headers}); 
		return this.http.post(this.url, JSON.stringify("getID"), options)
			.map((res:Response) => res.json())
            .catch((error:any) => Observable.throw(error.json().error || 'Error'));
			
	}
}