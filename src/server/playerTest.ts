import * as _ from 'lodash';
import {GameState} from './gameState';
import {Player} from './player'; 
import { BlueArcher } from 'deck/bluearcher';
import { BlueKnight } from 'deck/blueknight';
import { BlueSwordsman } from 'deck/blueswordsman';
import { Card } from 'deck/card';
import { CardToolkit } from 'deck/cardtoolkit';
import { GreenArcher } from 'deck/greenarcher';
import { GreenKnight } from 'deck/greenknight';
import { GreenSwordsman } from 'deck/greenswordsman';
import { RedArcher } from 'deck/redarcher';
import { RedKnight } from 'deck/redknight';
import { RedSwordsman } from 'deck/redswordsman';

export namespace PlayerTests {

    export function start() {
        console.info('Player Tests');

        result('first player first round', getTurn_first_player);
        result('third player first round', getTurn_first_round);
        result('first player second round', getTurn_second_round);
        result ('Player Serialization', playerSerialization);
    }

    function result( title: string, testCase: () => boolean) {
        console.info(`${title}: ${testCase() ? '\x1b[32m Passed' : '\x1b[31m Failed'}\x1b[0m`);
    }

    /**
     * Still need to use card class to test the following functions:
     *
     * @addCard(cardID: string[])
     * @discardCard(cardID: string)
     * @playCards(cardID: string[])
     */

    function getTurn_first_player(): boolean {
        let state = new GameState();
        state.getPlayers().push( new Player('player1') );

        let ply1 = state.currentTurn();
        return _.isEqual(ply1.showPlayerID(), 'player1');
    }

    function getTurn_first_round(): boolean {
        let state = new GameState();
        state.getPlayers().push( new Player('player1') );
        state.getPlayers().push( new Player('player2') );
        state.getPlayers().push( new Player('player3') );
        
        state.finishTurn();
        state.finishTurn();

        let ply3 = state.currentTurn();
        return _.isEqual(ply3.showPlayerID(), 'player3');
    }

    function getTurn_second_round(): boolean {
        let state = new GameState();
        state.getPlayers().push( new Player('player1') );
        state.getPlayers().push( new Player('player2') );
        state.getPlayers().push( new Player('player3') );
        
        state.finishTurn();
        state.finishTurn();
        state.finishTurn();

        let ply1 = state.currentTurn();
        return _.isEqual(ply1.showPlayerID(), 'player1');
    }

    function playerSerialization(): boolean {
        let state = new GameState();
        state.getPlayers().push( new Player('player1') );
        
        let str = state.toString();
        let newState = GameState.parse( str );

        let ply1 = newState.getPlayers()[0];

        return ply1 instanceof Player;
    }
	
/*	This should work, but we need to return a Card[] or a Card in addCard to test it. We can then switch it back once testing is done.
	function addCardTest(): void {
	    let state = new GameState();
        state.getCards().push(new GreenSwordsman());
        let str = state.toString();
        let newState = GameState.parse(str);

        let card = newState.drawCard();
		let Card: drawnCard = state.addCard(card);
		
		return drawnCard instanceof [GreenSwordsman];
	}
*/
}
