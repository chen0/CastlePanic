import * as _ from 'lodash';
import {DBConnector} from './database/database';
import {GameSession} from './gameSession';
import {GameState} from './gameState';
import {MonsterTests} from './monsters/test';
import {CardTests} from './deck/cardtests';

console.info('Starting Tests\n');

console.info('Unit Tests\n');

MonsterTests.start();
CardTests.start();