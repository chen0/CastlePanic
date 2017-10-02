import * as _ from 'lodash';
import {GameState} from '../gameState';
import {CardToolkit} from './cardtoolkit';
import { Card } from './card';
import { GreenSwordsman } from './greenswordsman';
import { RedSwordsman } from './redswordsman';
import { BlueSwordsman } from './blueswordsman';
import { GreenArcher } from './greenarcher';
import { BlueArcher } from './bluearcher';
import { RedArcher } from './redarcher';
import { BlueKnight } from './blueknight';
import { GreenKnight } from './greenknight';
import { RedKnight } from './redknight';


export namespace CardTests {

    export function start() {
        console.info('Card Tests');

        result ('Card Serialization', cardSerialization);
		result ('Draw Card', drawCard);
		
    }

    function result( title: string, testCase: () => boolean) {
        console.info(`${title}: ${testCase() ? '\x1b[32m Passed' : '\x1b[31m Failed'}\x1b[0m`);
    }


    function cardSerialization(): boolean {
        let state = new GameState();
        state.getCards().push( new GreenSwordsman() );
        
        let str = state.toString();
        let newState = GameState.parse( str );

        let card = newState.getCards()[0];

        return card instanceof GreenSwordsman;
    }
	

	function drawCard(): boolean {
		let state = new GameState();
        state.getCards().push( new GreenSwordsman() );
        state.getCards().push( new BlueSwordsman() );
        let str = state.toString();
        let newState = GameState.parse( str );

        let card = newState.drawCard();
		return card instanceof BlueSwordsman;
		
	}

/*	
	function deckRemaining(): boolean {
		let state = new GameState();
		let usedCards = [];
        state.getCards().push( new GreenSwordsman() );
        state.getCards().push( new BlueArcher() );
		state.getCards().push( new RedSwordsman() );
        state.getCards().push( new BlueSwordsman() );
        let str = state.toString();
        let newState = GameState.parse( str );

        let card = newState.drawCards();
		usedCards.push(card);
		let card = newState.drawCards();
		usedCards.push(card);
		return usedCards instanceof [BlueSwordsman, GreenSwordsman];
		}
*/
}
