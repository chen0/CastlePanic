import { Color, Position, Ring } from '../position';
import { Card } from './card';

export class GreenArcher extends Card {

    constructor() {
        super('GreenArcher', Ring.ARCHER, Color.GREEN);
    }

}
