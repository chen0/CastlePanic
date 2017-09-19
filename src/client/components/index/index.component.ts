import {Component, TemplateRef, Inject, ViewEncapsulation, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import template from './index.template.html';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import css from './index.css';
import { Observable } from 'rxjs';
import { GameSessionService } from '../../services/game.session.service';
import { Game } from '../../services/game';

@Component({
    selector: 'index',
    template: template,
    //encapsulation: ViewEncapsulation.None,

    styles: [css]
})
export class IndexComponent implements OnInit {
    private count: number = 1;
	public modalRef: BsModalRef;
	public game: Game;
    public oldgame: Game;
	public sessionID: String;
	public errorMessage: String;
    public myStyle: object = {};

	constructor( @Inject(GameSessionService) private gameService: GameSessionService, @Inject(BsModalService) private modalService: BsModalService, @Inject(Router) private router: Router) {

	}
 
	public openModal(template: TemplateRef<any>) {
		this.modalRef = this.modalService.show(template);
 	}

 	public initSession() {
 		this.gameService.getGameSessionID()
 			.subscribe(game => this.game = game); 
 	}

 	public createSession(template: TemplateRef<any>) {

 		this.gameService.getGameSessionID()
 			.subscribe(game => this.game = game); 

 		this.modalRef = this.modalService.show(template);
 	} 

    public toNewLobby() {
        this.modalRef.hide();
        this.router.navigate(['/lobby', this.game.gameCode.toString()]);
    }

    public toLobby(sessionID: string) {
    	this.modalRef.hide();
        this.router.navigate(['/lobby', sessionID]);
    }

    ngOnInit(): void {
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