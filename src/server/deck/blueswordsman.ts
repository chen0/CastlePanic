import { Color, Position, Ring } from '../position';
import { Card } from './card';

export class BlueSwordsman extends Card {

    constructor() {
        super('BlueSwordsman', Ring.SWORDSMAN, Color.BLUE);
    }

}
