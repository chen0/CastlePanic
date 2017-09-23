import { JsonObject, JsonProperty } from 'json2typescript';
import * as _ from 'lodash';
import {Position} from '../position';
import { Goblin } from './goblin';
import { Orc } from './orc';
import { Troll } from './troll';

@JsonObject
export class Monster {

    @JsonProperty('type', String)
    public type: string = '';

    @JsonProperty('position', Position)
    public position: Position = undefined;

    @JsonProperty('health', Number)
    protected health: number = 0;

    constructor(health: number, type: string, position) {
        this.health = health;
        this.type = type;
        this.position = position;
    }

    /**
     * Inflicts a normal hit on a monster
     * 
     * @returns {boolean} 
     * @memberof Monster
     */
    public hit(): boolean {
        this.health--;
        return this.isDead();
    }

    /**
     * Kills a monster regardless of remaining health
     * 
     * @memberof Monster
     */
    public kill(): void {
        this.health = 0;
    }

    /**
     * Checks whether monster is dead
     * 
     * @returns {boolean}   - true monster is dead, false if monster is alive
     * @memberof Monster
     */
    public isDead(): boolean {
        return this.health < 1;
    }

    /**
     * Get the health monster has left
     * 
     * @returns {number}    - health remaing
     * @memberof Monster
     */
    public getHealth(): number {
        return this.health;
    }

    /**
     * Should be called whenever a user draws a monster. This is where we could add special effects
     * 
     * @memberof Monster
     */
    public onDraw(): void {
        // children of the monster class can override this
    }
}
