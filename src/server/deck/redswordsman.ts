import { Color, Position, Ring } from '../position';
import { Card } from './card';

export class RedSwordsman extends Card {

    constructor() {
        super('RedSwordsman', Ring.SWORDSMAN, Color.RED);
    }

}
