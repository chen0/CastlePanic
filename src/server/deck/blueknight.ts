import { Color, Position, Ring } from '../position';
import { Card } from './card';

export class BlueKnight extends Card {

    constructor() {
        super('BlueKnight', Ring.ARCHER, Color.BLUE);
		//bug #2 blueknight can't be the knight position.
    }

}
