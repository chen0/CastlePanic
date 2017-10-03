import * as _ from 'lodash';
import {Position, Ring} from '../position';
import {Tower} from '../tower';

export namespace TowerTests {

    function result( title: string, testCase: () => boolean) {
        console.info(`${title}: ${testCase() ? '\x1b[32m Passed' : '\x1b[31m Failed'}\x1b[0m`);
    }

    export function start() {
        console.info('Tower Tests\n');

        result('Tower hit() value', hitTower);
        result('Tower hit() health', hitTower_health);
        result('Tower fortify() health', fortify);
        result('Tower fortify() fallen tower', fortifyFallenTower);
        result('Tower fortify() max health', fortifyMaxHealth);
        result('Tower createTowers()', getTowers);
    }

    function hitTower(): boolean {
        let p1 = new Position(Ring.CASTLE, 1);
        let t1 = new Tower(p1, 2);
        let r = t1.hit();
        let health = t1.getHealth();
        return _.isEqual(r, false) && _.isEqual(health, 1);
    }

    function hitTower_health(): boolean {
        let p1 = new Position(Ring.CASTLE, 1);
        let t1 = new Tower(p1, 2);
        t1.hit();
        let health = t1.getHealth();
        return _.isEqual(health, 1);
    }

    function fortify(): boolean {
        let p1 = new Position(Ring.CASTLE, 1);
        let t1 = new Tower(p1, 2);
        let r = t1.fortify();
        let health = t1.getHealth();
        return _.isEqual(r, true) && _.isEqual(health, 3);
    }

    function fortifyFallenTower(): boolean {
        let p1 = new Position(Ring.CASTLE, 1);
        let t1 = new Tower(p1, 0);
        let r = t1.fortify();
        let health = t1.getHealth();
        return _.isEqual(r, false) && _.isEqual(health, 0);
    }
    
    function fortifyMaxHealth(): boolean {
        let p1 = new Position(Ring.CASTLE, 1);
        let t1 = new Tower(p1, 3);
        let r = t1.fortify();
        let health = t1.getHealth();
        return _.isEqual(r, false) && _.isEqual(health, 3);
    }

    function getTowers(): boolean {
        let towers: Tower[] = Tower.createTowers();
        let error: boolean = false;
        for(let i = 0; i < towers.length; i++) {
            if( !_.isEqual( towers[i].getHealth(), 2) ) {
                error = true;
            }
            if( !_.isEqual( towers[i].getPosition().getRing(), Ring.CASTLE) ) {
                error = true;
            }
            if( !_.isEqual( towers[i].getPosition().getZone(), i + 1) ) {
                error = true;
            }
        }
        return !error;
    }

}
