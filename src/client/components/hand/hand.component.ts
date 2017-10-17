import {Component, EventEmitter, Inject, Input, OnDestroy, OnInit , Output } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import * as _ from 'lodash';
import css from './hand.css';
import template from './hand.template.html';

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

    // card that has been selected
    private selectedCardIndex: number;

    @Output() private cardIndexChanged = new EventEmitter<number>();
    @Input() private nickname: string;
    @Input() set players(playerArray: any[]) {
        let player = _.find(playerArray, (p: any) => _.isEqual( _.get(p, 'userid', ''), this.nickname));
        if (player) {
            this.cards = _.get(player, 'cards', []);
        }
    }

    constructor() {
        this.selectedCardIndex = -1;
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
