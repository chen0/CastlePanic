import * as _ from 'lodash';
import {GameState} from '../gameState';
import {Goblin} from './goblin';
import {Monster} from './monster';
import {Orc} from './orc';
import {MonsterToolkit} from './toolkit';
import {Troll} from './troll';

export namespace MonsterTests {

    export function start() {
        console.info('Monster Tests');

        result('Troll hit', trollHit);
        result('Troll kill', trollKill);
        result('Orc hit', orcHit);
        result('Goblin hit', goblinHit);
        result ('Monster Serialization', monsterSerialization);
    }

    function result( title: string, testCase: () => boolean) {
        console.info(`${title}: ${testCase() ? '\x1b[32m Passed' : '\x1b[31m Failed'}\x1b[0m`);
    }

    function trollHit(): boolean {
        let t: Monster = new Troll();
        
        t.hit();

        let health = t.getHealth();
        return _.isEqual(health, 2);
    }

    function trollKill(): boolean {
        let t: Monster = new Troll();
        t.hit();
        return !t.isDead();
    }

    function orcHit(): boolean {
        let o: Monster = new Orc();
        o.hit();
        let health = o.getHealth();
        return _.isEqual(health, 1);
    }

    function goblinHit(): boolean {
        let g: Monster = new Goblin();
        g.hit();
        return g.isDead();
    }

    function monsterSerialization(): boolean {
        let state = new GameState();
        state.getMonsters().push( new Troll() );
        
        let str = state.toString();
        let newState = GameState.parse( str );

        let monster = newState.getMonsters()[0];

        return monster instanceof Troll;
    }

}
