import { JsonObject, JsonProperty } from 'json2typescript';
import * as _ from 'lodash';
import { Position } from '../position';
import { Ring } from '../position';
import { Color } from '../position';
import { BlueArcher } from './bluearcher';
import { BlueKnight } from './blueknight';
import { BlueSwordsman } from './blueswordsman';
import { GreenArcher } from './greenarcher';
import { GreenKnight } from './greenknight';
import { GreenSwordsman } from './greenswordsman';
import { RedArcher } from './redarcher';
import { RedKnight } from './redknight';
import { RedSwordsman } from './redswordsman';

@JsonObject
export class Card {

    @JsonProperty('type', String)
    public type: string = '';

    @JsonProperty('ring', Number)
    public ring: number = undefined;

    @JsonProperty('color', Number)
    public color: number = undefined;

    constructor(type: string, ring, color) {
        this.ring = ring;
        this.type = type;
        this.color = color;
    }

}
