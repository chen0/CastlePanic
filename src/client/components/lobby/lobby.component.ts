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

    constructor( 
        @Inject(Router) private router: Router, 
        @Inject(ActivatedRoute) private activatedRoute: ActivatedRoute, 
        @Inject(GameSessionService) private gameService: GameSessionService, 
        @Inject(AlertCenterService) private service: AlertCenterService
    ) {
        this.alive = true; 
        this.interval = 2000; 
        this.timer = Observable.timer(0, this.interval); 
    }

    private ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            this.lobbyid = params['sessionid']; 
            this.nickname = params['nickname']; 
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
        this.gameService.checkUserID(this.lobbyid, this.nickname)
            .subscribe(
                (checkID) => {
                    this.checkID = checkID;
                    if (!this.checkID.success) {
                        const alert = Alert.create(AlertType.DANGER, '<b>OOPS, </b>Do not touch the url', 5000);
                        this.service.alert(alert);
                        this.router.navigate(['/']);
                        this.timer.subscribe(() => {
                            this.ngOnDestroy(); 
                        });
                    } else {
                        this.gameService.checkGameCode(this.lobbyid)
                            .subscribe(
                                (checkID2) => {
                                    this.checkID2 = checkID2;
                                    if (!this.checkID2.success) {
                                        const alert = Alert.create
                                        (AlertType.DANGER, '<b>OOPS, </b>Do not touch the url', 5000);
                                        this.service.alert(alert);
                                        this.router.navigate(['/']);
                                    } else {
                                        this.gameService.lobbyInfo(this.lobbyid, this.nickname)
                                           .subscribe((lobbyinfo) => {
                                               this.users = lobbyinfo.users; 
                                               this.roles = lobbyinfo.role; 
                                            });  
                                    }
                            });
                    }
            }); 
    }

    private test() {
        this.router.navigate(['/test']);
    }
}
