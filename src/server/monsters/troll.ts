import {JsonObject, JsonProperty} from 'json2typescript';
import {Position, Ring} from '../position';
import {Monster} from './monster';

@JsonObject
export class Troll extends Monster {

    constructor() {
        super(3, 'Troll', new Position( Ring.OFF_BOARD, 1) );
    }
}
