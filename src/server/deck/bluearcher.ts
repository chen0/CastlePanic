import { Color, Position, Ring } from '../position';
import { Card } from './card';

export class BlueArcher extends Card {

    constructor() {
        super('BlueArcher', Ring.ARCHER, Color.BLUE);
    }

}
