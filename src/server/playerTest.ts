import * as _ from 'lodash';
import {GameState} from './gameState';
import {Player} from './player'; 

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

}
