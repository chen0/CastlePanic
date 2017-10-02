import { Color, Position, Ring } from '../position';
import { Card } from './card';

export class RedKnight extends Card {

    constructor() {
        super('RedKnight', Ring.KNIGHT, Color.RED);
    }

}
