import { Color, Position, Ring } from '../position';
import { Card } from './card';

export class RedArcher extends Card {

    constructor() {
        super('RedArcher', Ring.ARCHER, Color.RED);
    }

}
