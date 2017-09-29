import * as _ from 'lodash';
import {DBConnector} from './database/database';
import {DatabaseTest} from './database/test';
import {GameSession} from './gameSession';
import {GameState} from './gameState';
import {MonsterTests} from './monsters/test';
import {ApiTest} from './testing/api.test';

console.info('Starting Tests\n');

console.info('Unit Tests\n');

let dbTest = new DatabaseTest( () => {
    console.info('\n');
    
    MonsterTests.start();

    console.info('\n');
    let apiTest = new ApiTest( () => {
        console.info('\ncomplete');
    });
});
