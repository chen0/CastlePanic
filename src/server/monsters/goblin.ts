import {JsonObject, JsonProperty} from 'json2typescript';
import {Position, Ring} from '../position';
import {Monster} from './monster';

@JsonObject
export class Goblin extends Monster {

    constructor() {
        super(1, 'Goblin', new Position( Ring.OFF_BOARD, 1) );
    }
}
