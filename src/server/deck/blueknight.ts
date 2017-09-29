import {Card} from './card';
import {Position, Ring, Color} from '../position';

export class BlueKnight extends Card{
	
	constructor(){
		super('BlueKnight', Ring.KNIGHT, Color.BLUE);
	}

}
