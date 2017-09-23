import {Position, Ring} from '../position';
import {Monster} from './monster';

export class Orc extends Monster {

    constructor() {
        super(2, 'Orc', new Position(Ring.OFF_BOARD, 1) );
    }
}
