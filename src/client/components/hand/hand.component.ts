import {Component, EventEmitter, Inject, Input, OnDestroy, OnInit , Output } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import * as _ from 'lodash';
import css from './hand.css';
import template from './hand.template.html';

import { Observable } from 'rxjs'; 
import { GameSessionService } from '../../services/game.session.service';

/**
 * The Hand Component requires 3 parameters
 *     nickname - name of user to display hand for
 *     players  - array of players
 *     cardIndexChanged - event called when index has changed
 * 
 * @export
 * @class HandComponent
 */
@Component({
    selector: 'hand',
    template: template,
    styles: [css]
})
export class HandComponent {

    // store cards
    private cards: any[];
    private playerID: number;
    private alive: boolean; 
    private timer: Observable<number>; 
    private interval: number; 

    // card that has been selected
    private selectedCardIndex: number;

    @Output() private cardIndexChanged = new EventEmitter<number>();
    @Input() private nickname: string;
    @Input() private playerArray: any[];
    @Input() private lobbyid: string;
    @Input() private win: boolean;
    @Input() private loss: boolean;
    @Input() set players(playerArray: any[]) {
        this.playerArray = playerArray;
        let player = _.find(playerArray, (p: any) => _.isEqual( _.get(p, 'userid', ''), this.nickname));
        if (player) {
            this.cards = _.get(player, 'cards', []);
            this.playerID = _.findIndex(playerArray, {userid: this.nickname}); 
        }

    }
    @Input() private turnNum: number;

    constructor( @Inject(GameSessionService) private gameService: GameSessionService ) {
        this.selectedCardIndex = -1;
        this.alive = true; 
        this.interval = 1000; 
        this.timer = Observable.timer(0, this.interval); 
    }

    public ngOnDestroy() {
        this.alive = false;
    }

    public ngOnInit() {
        this.timer
            .takeWhile(() => this.alive)
            .subscribe(() => {
                try {
                this.endTurn();
            } catch (Error) { /* empty */ }
            });
    }

    public endTurn() {
        if (this.turnNum % (_.size(this.playerArray)) === this.playerID) {
            document.getElementById('endTurnB').style.display = 'block';
        } else {
            document.getElementById('endTurnB').style.display = 'none';
        }
    }

    public sendEndTurn() {
        this.gameService.endTurn(this.lobbyid, this.nickname)
            .subscribe((success) => {
                document.getElementById('endTurnB').style.display = 'none';
            });
    }

    /**
     * Resets the card selection
     * 
     * @memberof HandComponent
     */
    public reset() {
        this.selectedCardIndex = -1;
    }

    /**
     * Gets the url for the image that corresponds with that card type
     * 
     * @private
     * @param {string} type - name of type
     * @returns {string}    - image url
     * @memberof HandComponent
     */
    private getImageUrl(type: string): string {
        return `/${_.camelCase(type)}.png`;
    }

    /**
     * Selects card and emits cardIndexChanged event if the selection changed
     * 
     * @private
     * @param {number} index - card index
     * @memberof HandComponent
     */
    private selectCard(index: number) {
        if ( !_.isEqual(this.selectedCardIndex, index) ) {
            this.selectedCardIndex = index;
            this.cardIndexChanged.emit( this.selectedCardIndex );
        }
    }
}
