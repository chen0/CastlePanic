import {Component, Inject, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import {Http} from '@angular/http';
import {Router} from '@angular/router';
import { Alert, AlertCenterComponent, AlertCenterService, AlertType } from 'ng2-alert-center'; 
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { Observable } from 'rxjs';
import { Game } from '../../services/game';
import { GameSessionService } from '../../services/game.session.service';
import css from './index.css';
import indexTemplate from './index.template.html';

@Component({
    selector: 'index',
    template: indexTemplate,
    styles: [css]
})
export class IndexComponent implements OnInit {
    public modalRef: BsModalRef;
    public game: Game;
    public sessionID: string;
    public checkID: any;
    public checkID2: any;
    public nickName: string;
    public myStyle: object = {};

    constructor( 
        @Inject(GameSessionService) private gameService: GameSessionService, 
        @Inject(BsModalService) private modalService: BsModalService, 
        @Inject(Router) private router: Router, 
        @Inject(AlertCenterService) private service: AlertCenterService, 
        @Inject(Http) private http: Http) {

    }
 
    public openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
     }

    public initSession() {
        this.game = new Game('Error, Please refreash the browser', 'error'); 
    }

    public createSession(template: TemplateRef<any>, name: any) {
        
        if (name === '') {
            const alert = Alert.create(AlertType.WARNING, '<b>Please enter a nickname. </b>', 5000);
            this.service.alert(alert);
        } else {

            this.gameService.getGameSessionID(name)
                .subscribe((game) => {
                    this.game = game; 
                    this.nickName = name; 
                    this.modalRef.hide();
                    this.modalRef = this.modalService.show(template);
                }); 
        }
    } 

    public toNewLobby() {
        this.modalRef.hide();
        this.router.navigate(['/lobby', this.game.gameCode.toString(), this.nickName]);
    }

    public toLobby(sessionID: string, name: string) {
        if (name === '' || sessionID === '') {
            const alert = Alert.create(AlertType.WARNING, '<b>Both fields are required.</b>', 5000);
            this.service.alert(alert);
        } else {
        this.gameService.checkUserID(sessionID, name)
            .subscribe(
                (checkID) => {
                    this.checkID = checkID;
                    if (this.checkID.success) {

                        const alert = Alert.create
                        (AlertType.DANGER, '<b>OOPS, </b>This nickname is already been taken for this game session.',
                        5000);

                        this.service.alert(alert);
                    } else {
                        this.gameService.checkGameCode(sessionID)
                            .subscribe(
                                (checkID2) => {
                                    this.checkID2 = checkID2;
                                    if (!this.checkID2.success) {
                                        const alert = Alert.create
                                        (AlertType.DANGER, '<b>HMMM, </b>This game session does not exist.', 5000);
                                        this.service.alert(alert);
                                    } else {
                                        this.gameService.joinGame(sessionID, name)
                                            .subscribe(
                                                (success) => {
                                                    if (success.isFull) {
                                                        const alert = Alert.create(AlertType.DANGER,
                                                            '<b>HMMM, </b>This game session is full.', 5000);
                                                        this.service.alert(alert);
                                                    } else {
                                                        this.modalRef.hide();
                                                        this.router.navigate(['/lobby', sessionID, name]);
                                                    }
                                                }); 
                                    }
                            });
                    }
            }); 
        }
    }

    public ngOnInit(): void {
        this.initSession();
        this.myStyle = {
            'position': 'fixed',
            'width': '100%',
            'height': '100%',
            'z-index': -1,
            'top': 0,
            'left': 0,
            'right': 0,
            'bottom': 0,
        };
    }
}
