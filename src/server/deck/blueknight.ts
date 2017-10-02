import { Color, Position, Ring } from '../position';
import { Card } from './card';

export class BlueKnight extends Card {

    constructor() {
        super('BlueKnight', Ring.KNIGHT, Color.BLUE);
    }

}
