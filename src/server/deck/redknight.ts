import {Card} from './card';
import {Position, Ring, Color} from '../position';

export class RedKnight extends Card{
	
	constructor(){
		super('RedKnight', Ring.KNIGHT, Color.RED);
	}

}
