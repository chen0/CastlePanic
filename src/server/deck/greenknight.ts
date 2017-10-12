import { Color, Position, Ring } from '../position';
import { Card } from './card';

export class GreenKnight extends Card {

    constructor() {
        super('GreenKnight', Ring.KNIGHT, Color.GREEN);
    }

}
