import { JsonObject, JsonProperty } from 'json2typescript';
import * as _ from 'lodash';
import { Position, Ring } from '../position';
import { Tower } from '../tower';
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

    /**
     * Moves the monster forward or clockwise if the monster is on the board.
     * If a tower is in it's way it deals damage to the tower and itself.
     * Monster does not move if it deals damage to a tower.
     * 
     * @param {Tower[]} towers     - towers that are currently on the game board
     * @returns {boolean}          - true if monster was killed, false if monster survived
     * @memberof Monster
     */
    public moveForward(towers: Tower[]): boolean {
        if (!_.isEqual(this.position.getRing(), Ring.OFF_BOARD) && !this.isDead()) {

            // get the next position for the monster
            let newPos: Position = this.position.nextPosition();

            // if a tower is still standing and at that position deal damage
            let tower = _.find(towers, (t: Tower) => t.getPosition().isEqual(newPos));
            if (tower && tower.isStanding()) {
                tower.hit();
                return this.hit();
            }

            // move monster
            this.position = newPos;
        }
        return false;
    }
}
