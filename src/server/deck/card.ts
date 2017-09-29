import { JsonObject, JsonProperty } from 'json2typescript';
import * as _ from 'lodash';
import {Position} from '../position';
import {Ring} from '../position';
import {Color} from '../position';
import { GreenSwordsman } from './greenswordsman';
import { RedSwordsman } from './redswordsman';
import { BlueSwordsman } from './blueswordsman';
import { GreenArcher } from './greenarcher';
import { BlueArcher } from './bluearcher';
import { RedArcher } from './redarcher';
import { GreenKnight } from './greenknight';
import { BlueKnight } from './blueknight';
import { RedKnight } from './redknight';


@JsonObject
export class Card {

    @JsonProperty('type', String)
    public type: string = '';

    @JsonProperty('ring', Number)
    public ring: Number = undefined;
	
	@JsonProperty('color', Number)
    public color: Number = undefined;

	
	
	//left this just in case we need damage numbers for cards (special cards, etc.)
//    @JsonProperty('damage', Number)
//    protected damage: number = 0;

    constructor(type: string, ring, color) {
        this.ring = ring;
        this.type = type;
        this.color = color;
    }

	
	/*
	so we can handle the logic of checking if a card can be played at a certain position in a few different ways
	the way that I'm assuming we're doing is making it so that when the player attempts to play it, the card 
	checks that it can be placed in the position. If so, something like this should be used. 
	
	NOTE: THIS IS DONE USING THE ASSUMPTION THAT THE PLAYER CLASS (or whatever class we use) UTILIZES A POSITION FUNCTION
	WHEN DECIDING WHERE TO PLACE A CARD
	
	public canPlace(Player player): boolean{
		if(player.position.ring === this.ring && player.position.color === this.color){
			return true;
		}
		else{
		
		
		
		
		
		
			printf("You can't play that card there!\n");
			return false;
		}
	}
	
	*/
	
}
