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

    constructor(type: string, ring, color) {
        this.ring = ring;
        this.type = type;
        this.color = color;
    }

	

	
}
