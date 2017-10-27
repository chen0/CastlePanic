import {Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import { Alert, AlertCenterComponent, AlertCenterService, AlertType } from 'ng2-alert-center'; 
import { Game } from '../../services/game';
import { GameSessionService } from '../../services/game.session.service';

import { Observable } from 'rxjs'; 
import { IntervalObservable } from 'rxjs/observable/IntervalObservable'; 

import css from './lobby.css';
import template from './lobby.template.html';

@Component({
    selector: 'lobby',
    template: template,
    styles: [css]
})
export class LobbyComponent {

    public lobbyid: string;
    public nickname: string;
    public users: string[]; 
    public roles: string[]; 
    public checkID: any;
    public checkID2: any;

    private alive: boolean; 
    private timer: Observable<number>; 
    private interval: number; 
    private showStartButton: boolean;

    constructor( 
        @Inject(Router) private router: Router, 
        @Inject(ActivatedRoute) private activatedRoute: ActivatedRoute, 
        @Inject(GameSessionService) private gameService: GameSessionService, 
        @Inject(AlertCenterService) private service: AlertCenterService
    ) {
        this.alive = true; 
        this.interval = 1000; 
        this.timer = Observable.timer(0, this.interval); 
    }

    private ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            this.lobbyid = params.sessionid; 
            this.nickname = params.nickname; 
        }); 

        this.timer
            .takeWhile(() => this.alive)
            .subscribe(() => {
                this.lobbyInfo();
            });
    }

    private ngOnDestroy() {
        this.alive = false;
    }

    private lobbyInfo() {




        this.gameService.lobbyInfo(this.lobbyid, this.nickname)
           .subscribe((lobbyinfo) => {
               this.users = lobbyinfo.users; 
               this.roles = lobbyinfo.role; 
               if (this.roles[this.users.indexOf(this.nickname)] !== 'owner') {
                   this.showStartButton = true; 
               } else {
                   this.showStartButton = true;
               }
        });  
    

    }

    private startGame() {
        this.gameService.startGame(this.lobbyid, this.nickname)
            .subscribe((game) => {
                this.router.navigate(['/game', this.lobbyid, this.nickname]);
        }); 
    }
}
