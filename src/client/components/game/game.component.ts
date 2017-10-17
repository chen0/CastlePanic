import {Component, Inject, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import * as _ from 'lodash';
import * as PIXI from 'pixi.js';
import {HandComponent} from '../hand/hand.component';
import template from './game.template.html';

// declare var PIXI: any;

@Component({
    selector: 'test',
    template: template
})
export class GameComponent {

    // reference to child component
    @ViewChild(HandComponent) private hand: HandComponent;

    // NOTE: you can update the hand component by resetting the value of players
    // this.hand.players = this.playerArray

    /**
     * Mock player Array to pass into hand component
     */
    private playerArray: any[] = [{userid: 'ben', cards: [
        {type: 'BlueArcher', ring: 0, color: 0},
        {type: 'GreenKnight', ring: 0, color: 0},
        {type: 'RedSwordsman', ring: 0, color: 0},
        {type: 'BlueSwordsman', ring: 0, color: 0},
        {type: 'GreenArcher', ring: 0, color: 0},
        {type: 'RedArcher', ring: 0, color: 0}
    ]}];
    // mock nickname to pass into hand component
    private nickname: string = 'ben';

    // card selected in hand
    private selectedCard: number = -1;

    constructor( @Inject(Router) private router: Router) {
        
    }

    /**
     * Reset the hand component
     * 
     * @private
     * @memberof GameComponent
     */
    private reset() {
        this.hand.reset();
        this.selectedCard = -1;
    }

    /**
     * Updates the selectedCard index, called by child component
     * 
     * @private
     * @param {number} index 
     * @memberof GameComponent
     */
    private cardIndex(index: number) {
        this.selectedCard = index;
    }

}
