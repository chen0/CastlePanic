import {Component, EventEmitter, Inject, Input, OnDestroy, OnInit , Output } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import * as _ from 'lodash';
import { Alert, AlertCenterComponent, AlertCenterService, AlertType } from 'ng2-alert-center';
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
    private timesDiscarded: number;

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
            this.timesDiscarded = _.get(player, 'timesDiscarded');
        }

    }
    @Input() private turnNum: number;

    constructor( @Inject(GameSessionService) private gameService: GameSessionService,
                 @Inject(AlertCenterService) private service: AlertCenterService, ) {
        this.selectedCardIndex = -1;
        this.alive = true; 
        this.interval = 1000; 
        this.timer = Observable.timer(0, this.interval); 
    }

    public ngOnDestroy() {
        this.alive = false;
    }

    public isMyTurn(): boolean {
        return _.isEqual(this.turnNum % (_.size(this.playerArray) ), this.playerID);
    }

    public sendEndTurn() {
        this.gameService.endTurn(this.lobbyid, this.nickname)
            .subscribe((success) => {
                // empty
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

    private discard() {
        if ( _.isEqual(this.selectedCardIndex, -1) ) {
            const alert = Alert.create(AlertType.DANGER, `<b>Please select a card first</b>`, 5000);
            this.service.alert(alert);
        } else {
            this.gameService.discard(this.lobbyid, this.nickname, this.selectedCardIndex)
                .subscribe((response) => {
                    if (response.success) {
                        this.reset();
                        let url = this.getImageUrl(response.newCard.type);
                        const alert = Alert.create(AlertType.INFO,
                            `<b>New Card</b><img src='${url}' width="75" height="75">`, 5000);
                        this.service.alert(alert);
                    } else {
                        const alert = Alert.create(AlertType.DANGER, `<b>Error you cannot discard</b>`, 5000);
                        this.service.alert(alert);
                    }
                });
        }
    }
}
