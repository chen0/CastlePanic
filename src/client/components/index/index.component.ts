import {Component, Inject, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import {Router} from '@angular/router';
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
    public oldgame: Game;
    public sessionID: string;
    public errorMessage: string;
    public nickName: string;
    public myStyle: object = {};

    constructor( 
        @Inject(GameSessionService) private gameService: GameSessionService, 
        @Inject(BsModalService) private modalService: BsModalService, 
        @Inject(Router) private router: Router) {

    }
 
    public openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
     }

     public initSession() {
        this.game = new Game('Oops, you have to enter a nickname first. '); 
     }

     public createSession(template: TemplateRef<any>, name: string) {
        
         this.gameService.getGameSessionID(name)
             .subscribe((game) => this.game = game); 

         this.modalRef.hide();
         this.modalRef = this.modalService.show(template);
     } 

    public toNewLobby() {
        this.modalRef.hide();
        this.router.navigate(['/lobby', this.game.gameCode.toString()]);
    }

    public toLobby(sessionID: string, nickName: string) {
        this.modalRef.hide();
        this.router.navigate(['/lobby', sessionID]);
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
